import React, { useState, useEffect } from "react";

const ChatBot = ({ setIsChatOpen }) => {
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
        const poiResponse = await fetch(`http://localhost:3000/points_of_interests?city_id=${cityIds}`);
        const poiData = await poiResponse.json();
        setPoiData(poiData);

        const hotelResponse = await fetch(`http://localhost:3000/accomodations?city_id=${cityIds}`);
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
        body: JSON.stringify({ userPrompt }),
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
      setInput("");
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: messageText }),
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

    const toggleChat = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      setIsChatOpen(newState); // actualizează și starea din Home
      return newState;
    });
  };

  return (
    <div className="darkMode bg-white rounded-md fixed bottom-[12vh] right-[12vw] z-[1] font-myfont">
      <button
        className="absolute -right-20 -bottom-10 w-[60px] h-[60px] rounded-full bg-sky-500 text-white text-2xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        onClick={toggleChat}
        title="Open Chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12.75c0 1.591 1.275 3.125 3.75 3.75a.75.75 0 01.558.57l.442 1.777a.75.75 0 001.45.092l.504-1.463a.75.75 0 01.712-.526h6.084c2.58 0 4.25-1.563 4.25-3.25V9c0-1.687-1.67-3.25-4.25-3.25H6.75C4.17 5.75 2.25 7.313 2.25 9v3.75z"
          />
        </svg>
      </button>

      {!isOpen ? (
        <br></br>
      ) : (
        <div className=" darkModeTop3 h-[76vh] w-[76vw] rounded-xl shadow-2xl border border-gray-200 flex flex-col animate-slide-up">
          <div className="bg-sky-500 text-white p-3 font-bold flex items-center justify-between rounded-t-xl">
            <button
              onClick={handleNewChat}
              className="hover:scale-110 transition group flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75c0 1.591 1.275 3.125 3.75 3.75a.75.75 0 01.558.57l.442 1.777a.75.75 0 001.45.092l.504-1.463a.75.75 0 01.712-.526h6.084c2.58 0 4.25-1.563 4.25-3.25V9c0-1.687-1.67-3.25-4.25-3.25H6.75C4.17 5.75 2.25 7.313 2.25 9v3.75z"
                />
              </svg>
              <span className="ml-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                New Chat
              </span>
            </button>

            <span className="text-xl mx-auto">Chat with Bot</span>
            <button
              className="text-sky-500 bg-white px-2 py-1 rounded hover:bg-gray-100"
              onClick={toggleChat}
              title="Close"
            >
              ✖
            </button>
          </div>

          <div className="flex justify-between gap-2 px-4 py-2">
            <button
              onClick={handleNewVacationsChat}
              className={`flex-1 py-2 px-4  font-bold text-white text-sm ${
                activeChat === "vacations"
                  ? "bg-sky-500 border-2 border-sky-400 shadow-md scale-105"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } transition`}
            >
              🔍 Search Vacations
            </button>
            <button
              onClick={handleNewChatGPT}
              className={`flex-1 py-2 px-4  font-bold text-white text-sm ${
                activeChat === "chatGPT"
                  ? "bg-sky-500 border-2 border-sky-400 shadow-md scale-105"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } transition`}
            >
              💬 Talk to Bot
            </button>
            <button
              onClick={handleShowLinks}
              className={`flex-1 py-2 px-4  font-bold text-white text-sm ${
                activeChat === "links"
                  ? "bg-sky-500 border-2 border-sky-400 shadow-md scale-105"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } transition`}
            >
              🔗 Useful Links
            </button>
          </div>

          <div className="darkMode flex-1 p-2 overflow-y-auto bg-gray-50 space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`darkModeTop3 flex items-start gap-2 max-w-[75%] p-2 rounded-lg text-sm leading-tight ${
                  message.sender === "bot"
                    ? "bg-gray-200 self-start"
                    : "bg-sky-100 self-end text-right"
                }`}
              >
                <img
                  src={
                    message.sender === "bot"
                      ? "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*I9KrlBSL9cZmpQU3T2nq-A.jpeg"
                      : "https://img.freepik.com/free-vector/sky-circle-with-white-user_78370-4707.jpg"
                  }
                  alt={message.sender}
                  className="w-8 h-8  object-cover"
                />
                <div className="whitespace-pre-wrap">{message.text}</div>
              </div>
            ))}
            <div id="messagesEnd" />
          </div>

          {activeChat && (
            <div className="flex border-t border-gray-200 p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
