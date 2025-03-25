from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Load a pre-trained chatbot model (like Facebook's BlenderBot)
chatbot = pipeline("conversational", model="facebook/blenderbot-400M-distill")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        response = chatbot(request.message)
        return {"reply": response[0]['generated_text']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
