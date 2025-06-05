import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { queryDatabase } from "./queryDB"; // importă funcția ta

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { userPrompt } = req.body;
  if (!userPrompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const { finalResponse } = await queryDatabase(userPrompt);
    res.json({ response: finalResponse });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot API running on http://localhost:${PORT}`);
});
