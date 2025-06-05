import { DataAPIClient } from "@datastax/astra-db-ts";
import { Client } from "pg";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

interface GeminiEmbeddingResponse {
  embedding: { values: number[] };
}

const embeddingFromGemini = async (text: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text }] },
        }),
      }
    );
    if (!response.ok)
      throw new Error(`Gemini API error: ${await response.text()}`);
    const data = (await response.json()) as GeminiEmbeddingResponse;
    if (!Array.isArray(data.embedding?.values))
      throw new Error("Invalid Gemini embedding");
    return data.embedding.values;
  } catch (error) {
    console.error("embeddingFromGemini error:", error);
    throw error;
  }
};

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_NAMESPACE,
  GOOGLE_API_KEY,
  NEON_DATABASE_URL,
  ASTRA_DB_COLLECTION_2,
} = process.env;

if (
  !ASTRA_DB_APPLICATION_TOKEN ||
  !ASTRA_DB_API_ENDPOINT ||
  !ASTRA_DB_COLLECTION_2 ||
  !ASTRA_DB_NAMESPACE ||
  !GOOGLE_API_KEY ||
  !NEON_DATABASE_URL
) {
  throw new Error("Missing environment variables");
}

// Inițializarea clientului Astra DB
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

// Inițializarea clientului Neon (PostgreSQL)
const neonClient = new Client({
  connectionString: NEON_DATABASE_URL,
});

// Inițializarea splitter-ului
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 256, // Redus pentru texte scurte
  chunkOverlap: 50,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION_2, {
      vector: {
        dimension: 768, // Google Gemini embedding-001 => 768 dim
        metric: similarityMetric,
      },
    });
    console.log("Collection created:", res);
  } catch (error) {
    console.error("createCollection error:", error);
    throw error;
  }
};

const loadSampleData = async () => {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION_2);

    // Conectare la baza de date Neon
    await neonClient.connect();
    console.log("Connected to Neon database");

    // Verifică schema tabelului
    const schemaQuery =
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'accomodations'";
    const schemaResult = await neonClient.query(schemaQuery);
    console.log("Table schema:", schemaResult.rows);

    // Extrage datele din tabelul Neon
    const sourceQuery = "SELECT name, rating, price FROM accomodations";
    const sourceResult = await neonClient.query(sourceQuery);
    const records = sourceResult.rows;

    console.log(`Retrieved ${records.length} records from Neon database`);
    if (records.length > 0) {
      console.log("Sample record:", records[0]);
    } else {
      console.warn("No records found in accomodations table");
      return;
    }

    // Pentru fiecare înregistrare, procesăm name, rating, și price
    let recordIndex = 1; // Înlocuitor pentru 'id'
    for (const record of records) {
      const { name, rating, price } = record;
      console.log(`Processing record ${recordIndex}:`, { name, rating, price });

      // Validăm datele
      if (!name && !rating && !price) {
        console.warn(`Skipping record ${recordIndex}: all fields are empty`);
        recordIndex++;
        continue;
      }

      // Creăm un text descriptiv care include name, rating, și price
      const textToProcess = `${name || "Accommodation"} - Rated ${
        rating || "N/A"
      } stars, priced at $${price || "N/A"}`.trim();

      // Verificăm dacă textul este valid
      if (!textToProcess) {
        console.warn(`Skipping record ${recordIndex}: textToProcess is empty`);
        recordIndex++;
        continue;
      }

      // Împărțim textul în chunk-uri
      const chunks = await splitter.splitText(textToProcess);
      console.log(
        `Generated ${chunks.length} chunks for record ${recordIndex}`
      );

      // Pentru fiecare chunk, generăm embedding și inserăm în Astra DB
      for (const chunk of chunks) {
        if (!chunk.trim()) {
          console.warn(`Skipping empty chunk for record ${recordIndex}`);
          continue;
        }

        const vector = await embeddingFromGemini(chunk);

        const res = await collection.insertOne({
          $vector: vector,
          text: chunk,
          metadata: {
            source_id: recordIndex.toString(),
            source: "neon_db",
            name: name || "Unknown",
            rating: rating ? parseFloat(rating) : null, // Stocăm ca număr
            price: price ? parseInt(price) : null, // Stocăm ca număr
          },
        });
        console.log(`Inserted chunk for record ${recordIndex}:`, res);
      }
      recordIndex++;
    }
  } catch (error) {
    console.error("loadSampleData error:", error);
    throw error;
  } finally {
    await neonClient.end();
    console.log("Disconnected from Neon database");
  }
};

// Execută: întâi creează colecția, apoi încarcă datele
createCollection().then(() => loadSampleData());
