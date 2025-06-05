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
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt }),  // userPrompt aici
    });

    const data = await response.json();
    typeBotMessage(data.response, "chatGPT"); // raspunsul din backend este in campul "response"
  } catch (error) {
    console.error("Error:", error);
    typeBotMessage("Sorry, something went wrong. 😓", "chatGPT");
  }
};

const handleChatGPTMessage = async (messageText) => {
  try {
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt: messageText }),  // userPrompt aici
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
            <button className="close-btn" onClick={() => setIsOpen(false)} title="Close">
              ✖
            </button>
          </div>

          <div className="chat-actions">
            <button
              onClick={handleNewVacationsChat}
              className={activeChat === "vacations" ? "active" : ""}
            >
              🔍 Search Vacations
            </button>
            <button
              onClick={handleNewChatGPT}
              className={activeChat === "chatGPT" ? "active" : ""}
            >
              💬 Talk to Bot
            </button>
            <button
              onClick={handleShowLinks}
              className={activeChat === "links" ? "active" : ""}
            >
              🔗 Useful Links
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="avatar">
                  <img
                    src={message.sender === "bot" ? "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*I9KrlBSL9cZmpQU3T2nq-A.jpeg" : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1746549894~exp=1746553494~hmac=2f00b3d3854ad17093df1bbe06f43e8560b94e719e6a20b2a74b5743b463c5ef&w=826"}
                    alt={message.sender === "bot" ? "Bot" : "User"}
                    className="avatar-img"
                  />
                </div>
                <div className="message-text">{message.text}</div>
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