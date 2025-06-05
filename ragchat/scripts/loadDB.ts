import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
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
} = process.env;

const f1Data = [
  "https://www.bbc.com/travel/article/20250115-the-25-best-places-to-travel-in-2025",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 768, // Google Gemini embedding-001 => 768 dim
      metric: similarityMetric,
    },
  });
  console.log(res);
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);
  for await (const url of f1Data) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const vector = await embeddingFromGemini(chunk);

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });
      console.log(res);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

// 🔁 Execută: întâi creează colecția, apoi încarcă datele
loadSampleData();
