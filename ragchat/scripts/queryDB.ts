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
const callLanguageModelForCollection = async (prompt: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            `Decide which collection or maybe multiple collections to use based on the user's prompt. The collections are: 'vacation websites', 'accommodations', 'points of interest', 'airports', and 'cities'.
            Mention only the collections in the response, dont include any other information. Dont mention the collections name in the answer if they are not relevant to the user's request.`,
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
}

const callLanguageModelForEmotion = async (prompt: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            `Based on the user's prompt, determine the emotional tone of the response. The possible emotions are: 'happy', 'sad', 'angry', 'bored', 'confused', and 'curious'.
            Make the answer concise, short, and to the point. Dont mention the emotions name in the answer if they are not relevant to the user's request.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "deepseek-r1-distill-llama-70b",
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
}



export const queryDatabase = async (userPrompt: string, topK: number = 5) => {
  try {
    let foundEmotion = false;
    const emotion: string[] = [];
    const emotionResponse = await callLanguageModelForEmotion(userPrompt);
    console.log("Emotion Response:", emotionResponse);
    if (emotionResponse.includes("bored")) {
      emotion.push("bored");
      foundEmotion = true;
    }
    if (emotionResponse.includes("happy")) {
      emotion.push("happy");
      foundEmotion = true;
    } if (emotionResponse.includes("sad")) {
      emotion.push("sad");
      foundEmotion = true;
    } if (emotionResponse.includes("angry")) {
      emotion.push("angry");
      foundEmotion = true;
    } if (emotionResponse.includes("confused")) {
      emotion.push("confused");
      foundEmotion = true;
    } if (emotionResponse.includes("curious")) {
      emotion.push("curious");
      foundEmotion = true;
    }
    if (!foundEmotion) {
      console.log(" No specific emotion found in the response. Returning default/fallback response.");
      // fallback response
      emotion.push("neutral");
    }

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

    const webDocs = (await webResults.toArray()).map((doc) => {
  return `Web content: ${doc.text}`; 
});

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
    const collectionResponse = await callLanguageModelForCollection(userPrompt);
    console.log("Collection Response:", collectionResponse);
const documents: string[] = [];
let foundContext = false;
if (collectionResponse.includes("vacation websites")) {
  documents.push(...webDocs);
    foundContext = true;
}
if (collectionResponse.includes("accommodations")) {
  documents.push(...accomodationsDocs);
    foundContext = true;
}
if (collectionResponse.includes("points of interest")) {
  documents.push(...pointsOfInterestsDocs);
    foundContext = true;
}
if (collectionResponse.includes("airports")) {
  documents.push(...airportsDocs);
    foundContext = true;
}
if (collectionResponse.includes("cities")) {
  documents.push(...citiesDocs);
    foundContext = true;
}
if (!foundContext) {
  console.log(" No specific collection found in the response. Returning default/fallback response.");
  // fallback response
  documents.push("Sorry, no relevant information was found for your query.");
}


// Limităm la topK rezultate dacă sunt prea multe
const limitedDocuments = documents.slice(0, topK);

    // Construim prompt-ul cu context
    const context = limitedDocuments.join("\n\n");
    const newPrompt = `
      You are a travel assistant. Use the context below to answer concisely.
      Context:
      ${context}

      User Prompt:
      ${userPrompt}

      User Emotion:
      ${emotion.join(", ")}
      Instructions:
    
      Your output should include specific cities, points of interest, accommodations, and airports relevant to the user's request.
      If the user asks for links, provide relevant URLs from the context.
      If you dont have specific information about a thing in the context you can complete the answer with general information.
      If the context specifically says that no information is available, respond accordingly.
      If the context does not provide enough information, you can suggest general travel tips or ask for more details.
      Dont tell the user what information you have, just answer the question.
      Reddirect the user to parts of the website http://localhost:3001/vacation is for countries and hotels in those countries.
      http://localhost:3001/map is for maps and points of interest and airports.
      

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
    const userPrompt = "Im feeling quite energetic..What are some good place to visit in Rome? Can you give me some links to accomodations and points of interest?";
    const { newPrompt, finalResponse } = await queryDatabase(userPrompt);
    console.log("Prompt with Context:\n", newPrompt);
    console.log("\nFinal Response from Groq:\n", finalResponse);
  } catch (error) {
    console.error("Main execution failed:", error);
  }
};

main();
