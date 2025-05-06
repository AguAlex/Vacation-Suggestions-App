import React, { useState, useEffect } from "react";
import "./Chatbot.css"; // Importăm stilurile din fișier extern


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [cityIds, setCityIds] = useState([]);
  const [poiData, setPoiData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [botTimeout, setBotTimeout] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const messagesEndRef = document.getElementById("messagesEnd");
    messagesEndRef?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearchVacations = async () => {
    setActiveChat("vacations");
    const response = await fetch(`http://localhost:3000/cities?name=${input}`);
    const data = await response.json();

    if (data && Array.isArray(data) && data.length > 0) {
      const cityIds = data.map((city) => city.id);
      console.log("City IDs found:", cityIds); // 👈 AICI e log-ul adăugat

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

        const combinedMessage = {
          text: `I found the following points of interest: ${poiNames}.\nHotels: ${hotelNames}.`,
          sender: "bot",
        };

        setMessages((prevMessages) => [...prevMessages, combinedMessage]);
      }
    } else {
      const notFoundMessage = {
        text: `Sorry, I couldn't find any cities with the name "${input}".`,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, notFoundMessage]);
    }
    setInput("");
  };
  const handleNewVacationsChat = () => {
    setActiveChat("vacations");
    setInput("");

    const welcomeMessage = {
      text: "Let's find your next vacation! 🌴✈️\nType a city name to begin.",
      sender: "bot",
      chat: "vacations",
    };

    setMessages((prevMessages) => [...prevMessages, welcomeMessage]);
  };

  const handleNewChatGPT = async () => {
    setActiveChat("chatGPT"); // Setează chatul activ pe "chatGPT"

    const userPrompt = "Hello! What can you do?";

    // Adaugă mesajul userului în chat
    setMessages((prev) => [...prev, { text: userPrompt, sender: "user" }]);

    // Adaugă "Typing..." temporar
    const typingMessage = { text: "Typing...", sender: "bot" };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();

      // Elimină "Typing..." și adaugă răspunsul botului
      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Typing..."),
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Typing..."),
        { text: "Sorry, something went wrong. 😓", sender: "bot" },
      ]);
    }
  };

  const handleChatGPTMessage = async (messageText) => {
    const typingMessage = {
      text: "Typing...",
      sender: "bot",
      chat: "chatGPT",
    };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: messageText }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.chat === "chatGPT"),
        { text: data.response, sender: "bot", chat: "chatGPT" },
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.chat === "chatGPT"),
        {
          text: "Sorry, something went wrong. 😓",
          sender: "bot",
          chat: "chatGPT",
        },
      ]);
    }
  };

  const handleShowLinks = () => {
    setActiveChat("links"); // Setează chatul activ pe "links"

    const msg = {
      text: `Here are some useful links:\n- 🌍 Travel Portal: https://travel.example.com\n- 🏨 Hotels: https://hotels.example.com\n- 📞 Contact Support: https://support.example.com`,
      sender: "bot",
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleSendMessage = async () => {
    // setActiveChat("vacations"); // Setează chatul activ pe "vacations"

    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    // Setează mesajul utilizatorului în chat-ul activ
    setMessages((prevMessages) => [
      ...prevMessages.filter((msg) => msg.chat === activeChat),
      userMessage,
    ]);

    if (activeChat === "chatGPT") {
      await handleChatGPTMessage(input);
    } else if (activeChat === "vacations") {
      await handleSearchVacations(input);
    }
  };

  const handleNewChat = () => {
    if (botTimeout) {
      clearTimeout(botTimeout);
    }
    setMessages([]);
    setPoiData([]);
    setBotTimeout(null);
    setActiveChat(null); // Resetează chat-ul activ
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
          <span>Chat with Bot</span>
        </div>
        <div className="chat-actions">
          <button onClick={() => handleNewVacationsChat()}>
            🔍 Search Vacations
          </button>
          <button onClick={() => handleNewChatGPT()}>💬 Talk to Bot</button>
          <button onClick={() => handleShowLinks()}>🔗 Useful Links</button>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          <div id="messagesEnd" />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a city name..."
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
