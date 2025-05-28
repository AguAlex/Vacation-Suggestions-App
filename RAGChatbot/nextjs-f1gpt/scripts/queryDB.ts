import { DataAPIClient } from "@datastax/astra-db-ts";
import Groq from "groq-sdk";
import "dotenv/config";

interface GeminiEmbeddingResponse {
  embedding: { values: number[] };
}

const {
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_COLLECTION_2,
  ASTRA_DB_COLLECTION_3,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_COLLECTION_4,

  ASTRA_DB_COLLECTION_5,
  ASTRA_DB_NAMESPACE,
  GOOGLE_API_KEY,
  GROQ_API_KEY,
} = process.env;

if (
  !ASTRA_DB_APPLICATION_TOKEN ||
  !ASTRA_DB_API_ENDPOINT ||
  !ASTRA_DB_COLLECTION_2 ||
  !ASTRA_DB_COLLECTION_3 ||
  !ASTRA_DB_NAMESPACE ||
  !GOOGLE_API_KEY ||
  !GROQ_API_KEY
) {
  throw new Error("Missing environment variables");
}

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
const groq = new Groq({ apiKey: GROQ_API_KEY });

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

const callLanguageModel = async (prompt: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides accurate and detailed recommendations for travel destinations and accommodations based on the provided context.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });
    const responseText = chatCompletion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Invalid Groq response");
    }
    return responseText;
  } catch (error) {
    console.error("callLanguageModel error:", error);
    throw error;
  }
};

const queryDatabase = async (userPrompt: string, topK: number = 5) => {
  try {
    // Generăm embedding pentru prompt-ul utilizatorului
    const promptEmbedding = await embeddingFromGemini(userPrompt);

    // Accesăm colecțiile
    const webCollection = await db.collection(ASTRA_DB_COLLECTION);
    const accomodationsCollection = await db.collection(ASTRA_DB_COLLECTION_2);
    const pointsOfInterestsCollection = await db.collection(
      ASTRA_DB_COLLECTION_3
    );
    const airportsCollection = await db.collection(ASTRA_DB_COLLECTION_4);
    const citiesCollection = await db.collection(ASTRA_DB_COLLECTION_5);

    const webResults = await webCollection.find(
      {},
      {
        sort: { $vector: promptEmbedding },
        limit: Math.ceil(topK / 2), // Luăm jumătate din topK din fiecare colecție
        projection: { text: 1, metadata: 1, _id: 0 },
      }
    );
    // Căutăm top-k documente similare în ambele colecții
    const accomodationsResults = await accomodationsCollection.find(
      {},
      {
        sort: { $vector: promptEmbedding },
        limit: Math.ceil(topK / 2), // Luăm jumătate din topK din fiecare colecție
        projection: { text: 1, metadata: 1, _id: 0 },
      }
    );

    const pointsOfInterestsResults = await pointsOfInterestsCollection.find(
      {},
      {
        sort: { $vector: promptEmbedding },
        limit: Math.ceil(topK / 2),
        projection: { text: 1, metadata: 1, _id: 0 },
      }
    );
    const airportsResults = await airportsCollection.find(
      {},
      {
        sort: { $vector: promptEmbedding },
        limit: Math.ceil(topK / 2), // Luăm jumătate din topK din fiecare colecție
        projection: { text: 1, metadata: 1, _id: 0 },
      }
    );
    const citiesResults = await citiesCollection.find(
      {},
      {
        sort: { $vector: promptEmbedding },
        limit: Math.ceil(topK / 2), // Luăm jumătate din topK din fiecare colecție
        projection: { text: 1, metadata: 1, _id: 0 },
      }
    );

    const webDocs = await webResults.toArray();

    // Extragem și formatăm documentele
    const accomodationsDocs = (await accomodationsResults.toArray()).map(
      (doc) => {
        const { name, rating, price } = doc.metadata;
        return `Accommodation: ${doc.text} (Name: ${name}, Rating: ${
          rating || "N/A"
        }, Price: $${price || "N/A"})`;
      }
    );

    const pointsOfInterestsDocs = (
      await pointsOfInterestsResults.toArray()
    ).map((doc) => {
      const { name, description } = doc.metadata;
      return `Point of Interest: ${doc.text} (Name: ${name}, Description: ${
        description || "N/A"
      })`;
    });
    const airportsDocs = (await airportsResults.toArray()).map((doc) => {
      const { name, detailed_name, iataCode } = doc.metadata;
      return `Airport: ${doc.text} (Name: ${name}, Detailed Name: ${
        detailed_name || "N/A"
      }, IATA: ${iataCode || "N/A"})`;
    });

    const citiesDocs = (await citiesResults.toArray()).map((doc) => {
      const { city_name, country_name } = doc.metadata;
      return `City: ${doc.text} (Name: ${city_name}, Country: ${
        country_name || "N/A"
      })`;
    });

    // Combinăm documentele (până la topK în total)
    const documents = [
      ...webDocs,
      ...accomodationsDocs,
      ...pointsOfInterestsDocs,
      ...airportsDocs,
      ...citiesDocs,
    ].slice(0, topK);

    // Construim prompt-ul cu context
    const context = documents.join("\n\n");
    const newPrompt = `
      Context:
      ${context}

      User Prompt:
      ${userPrompt}
    
      Based on the provided context, recommend both accommodations,cities to visit, coutries, airports and points of interest relevant to the user's prompt. Provide a detailed and accurate response.
        Take into consideration what you find about those in the web 2025 vacations too.
      `;

    // Generăm răspunsul final folosind Groq
    const finalResponse = await callLanguageModel(newPrompt);

    return { newPrompt, finalResponse };
  } catch (error) {
    console.error("queryDatabase error:", error);
    throw error;
  }
};

const main = async () => {
  try {
    const userPrompt = "What cities do you have provided as context? ";
    const { newPrompt, finalResponse } = await queryDatabase(userPrompt);
    console.log("Prompt with Context:\n", newPrompt);
    console.log("\nFinal Response from Groq:\n", finalResponse);
  } catch (error) {
    console.error("Main execution failed:", error);
  }
};

main();
