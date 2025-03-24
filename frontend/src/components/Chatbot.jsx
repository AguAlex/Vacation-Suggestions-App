import React, { useState } from "react";
import "./Chatbot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]); // Stocăm mesajele
  const [input, setInput] = useState(""); // Stocăm input-ul utilizatorului

  // Funcția care se ocupă de trimiterea mesajelor
  const handleSendMessage = () => {
    if (input.trim() === "") return; // Nu trimitem mesaje goale

    // Adăugăm mesajul utilizatorului
    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Simulăm un răspuns din partea chatbot-ului
    setTimeout(() => {
      const botMessage = { text: `Bot: You said "${input}"`, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 2000); // Răspunsul chatbot-ului vine după 1 secundă

    // Resetăm input-ul
    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        <div className="chat-header">
          <h3>Chat with Bot</h3>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
