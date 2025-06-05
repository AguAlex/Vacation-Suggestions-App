// scripts/server.ts

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import queryDatabase from "./queryDB"; // Ensure queryDatabase is exported as default from queryDB.ts

import type { Request, Response } from "express";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req: Request, res: Response) => {
  const { userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const { finalResponse } = await queryDatabase(userPrompt);
    return res.json({ response: finalResponse });
  } catch (err) { 
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot API running on http://localhost:${PORT}`);
});
