import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTimeout, setBotTimeout] = useState(null); // Stocăm timeout-ul pentru bot
  const messagesEndRef = useRef(null);

  // Auto-scroll la ultimul mesaj
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return; // Nu trimitem mesaje goale
  
    // Adăugăm mesajul utilizatorului
    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    // Simulăm un răspuns din partea chatbot-ului
    const timeout = setTimeout(() => {
      const botMessage = { text: `Bot: You said "${input}"`, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 2000); // Răspunsul chatbot-ului vine după 2 secunde
    
    // Salvăm timeout-ul pentru a-l putea anula
    setBotTimeout(timeout);
  
    setInput(""); // Resetăm input-ul
  };
  
  
  const handleNewChat = () => {
    // Anulăm timeout-ul dacă există și botul nu a trimis încă mesajul
    if (botTimeout) {
      clearTimeout(botTimeout);
    }
    
    // Resetează mesajele și restul stărilor pentru a începe un nou chat
    setMessages([]);
    setBotTimeout(null); // Resetăm și timeout-ul
  };
  
  
  return (
    <div className="chatbot-container">
      <div className="chat-window">
        <div className="chat-header">
          <div className="new-chat">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-message-circle"
              >
                <path d="M21 2v12a4 4 0 0 1-4 4H4l-2 3V6a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
              </svg>
              <span className="new-chat-text">New Chat</span>
            </button>
          </div>
          <h3>Chat with Bot</h3>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <span>{message.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
