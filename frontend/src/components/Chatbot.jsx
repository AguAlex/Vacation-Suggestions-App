import React, { useState, useEffect } from "react";
import "./Chatbot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [cityIds, setCityIds] = useState([]);
  const [poiData, setPoiData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [botTimeout, setBotTimeout] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const messagesEndRef = document.getElementById("messagesEnd");
    messagesEndRef?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typeBotMessage = (fullText, chat = activeChat) => {
    let index = 0;
    const words = fullText.split(" ");
    let currentText = "";

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? "" : " ") + words[index];
        index++;

        setMessages((prevMessages) => {
          const last = prevMessages[prevMessages.length - 1];
          if (last && last.sender === "bot" && last.chat === chat) {
            const updated = [...prevMessages];
            updated[updated.length - 1] = { ...last, text: currentText };
            return updated;
          } else {
            return [...prevMessages, { text: currentText, sender: "bot", chat }];
          }
        });
      } else {
        clearInterval(interval);
      }
    }, 150);
  };

  const handleSearchVacations = async () => {
    setActiveChat("vacations");
    const response = await fetch(`http://localhost:3000/cities?name=${input}`);
    const data = await response.json();

    if (data && Array.isArray(data) && data.length > 0) {
      const cityIds = data.map((city) => city.id);
      setCityIds(cityIds);

      if (cityIds.length > 0) {
        const poiResponse = await fetch(
          `http://localhost:3000/points_of_interests?city_id=${cityIds}`
        );
        const poiData = await poiResponse.json();
        setPoiData(poiData);

        const hotelResponse = await fetch(
          `http://localhost:3000/accomodations?city_id=${cityIds}`
        );
        const hotelData = await hotelResponse.json();
        setHotelData(hotelData);

        const poiNames = poiData.map((poi) => poi.name).join(", ");
        const hotelNames = hotelData.map((hotel) => hotel.name).join(", ");

        const combinedText = `I found the following points of interest: ${poiNames}.\nHotels: ${hotelNames}.`;
        typeBotMessage(combinedText, "vacations");
      }
    } else {
      typeBotMessage(`Sorry, I couldn't find any cities with the name "${input}".`, "vacations");
    }

    setInput("");
  };

  const handleNewVacationsChat = () => {
    setActiveChat("vacations");
    setInput("");
    const welcomeText = "Let's find your next vacation! 🌴✈️\nType a city name to begin.";
    typeBotMessage(welcomeText, "vacations");
  };

  const handleNewChatGPT = async () => {
    setActiveChat("chatGPT");
  
    const userPrompt = `Hello! My name is ${storedUser?.nume || "user"} and from now on you will address me as ${storedUser?.nume || "user"}. Hello!`;
  
    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
  
      const data = await response.json();
      typeBotMessage(data.response, "chatGPT");
    } catch (error) {
      console.error("Error:", error);
      typeBotMessage("Sorry, something went wrong. 😓", "chatGPT");
    }
  };

  const handleChatGPTMessage = async (messageText) => {
    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: messageText }),
      });

      const data = await response.json();
      typeBotMessage(data.response, "chatGPT");
    } catch (error) {
      console.error("Error:", error);
      typeBotMessage("Sorry, something went wrong. 😓", "chatGPT");
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user", chat: activeChat };
    setMessages((prev) => [...prev, userMessage]);

    if (activeChat === "chatGPT") {
      await handleChatGPTMessage(input);
    } else if (activeChat === "vacations") {
      await handleSearchVacations(input);
    }

    setInput("");
  };

  const handleNewChat = () => {
    if (botTimeout) clearTimeout(botTimeout);
    setMessages([]);
    setPoiData([]);
    setBotTimeout(null);
    setActiveChat(null);
  };

  const handleShowLinks = () => {
    setActiveChat("links");
    const msg = `Here are some useful links:\n- 🌍 Travel Portal: https://travel.example.com\n- 🏨 Hotels: https://hotels.example.com\n- 📞 Contact Support: https://support.example.com`;
    typeBotMessage(msg, "links");
  };

  return (
    <div className="chatbot-fixed-container">
      {!isOpen ? (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)} title="Open Chat">
          💬
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <button className="new-chat-btn" onClick={handleNewChat}>
              New Chat
            </button>
            <span>Chat with Bot</span>
            <button className="close-btn" onClick={() => setIsOpen(false)} title="Close">
              ✖
            </button>
          </div>

          <div className="chat-actions">
            <button onClick={handleNewVacationsChat}>🔍 Search Vacations</button>
            <button onClick={handleNewChatGPT}>💬 Talk to Bot</button>
            <button onClick={handleShowLinks}>🔗 Useful Links</button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            <div id="messagesEnd" />
          </div>

          {activeChat && (
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
