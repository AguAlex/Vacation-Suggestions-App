import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

function Header({ user, setUser }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  const [showPersonalize, setShowPersonalize] = useState(false);

  const [activeFont, setActiveFont] = React.useState(() => {
    if (document.documentElement.classList.contains("font-large")) return "font-large";
    if (document.documentElement.classList.contains("font-medium")) return "font-medium";
    return "font-small";
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isScrolled = scrolled || !isHomePage;
  const baseHeaderClass = `w-full fixed top-0 z-50 flex justify-between items-center transition-colors duration-300 px-8 py-4 ${
    isScrolled ? "darkMode bg-sky-50" : "bg-transparent"
  }`;

  const buttonClass = `bg-transparent border-none font-medium text-base px-4 py-2 rounded-md hover:scale-105 hover:text-sky-500 transition ${
    isScrolled ? "darkMode text-black" : "text-white"
  }`;


  return (
    <header className={baseHeaderClass}>
      <ul className="flex items-center w-full gap-8 list-none m-0">
        
        <li>
          <Link to="/home">
            <img
              src="icon.png"
              alt="Logo"
              className="h-10 w-auto transition-transform duration-300 ease-in-out hover:scale-125"
            />
          </Link>
        </li>
        <li>
          <Link to="/vacation" className={buttonClass}>
            See Vacations
          </Link>
        </li>

        {!user ? (
          <>
            <li>
              <Link to="/login" className={buttonClass}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className={buttonClass}>
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/my-likes" className={buttonClass}>
                My Likes
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className={buttonClass}
              >
                Logout
              </button>
            </li>
            <li>
              <Link to="/map" className={buttonClass}>
                Map
              </Link>
            </li>
          </>
        )}
        
        <li className="ml-auto relative inline-block text-left">
          <button
            type="button"
            onClick={() => setShowPersonalize(!showPersonalize)}
            className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition focus:outline-none"
            aria-expanded={showPersonalize}
            aria-haspopup="true"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-gray-800 text-white shadow-lg ring-1 ring-black/5 focus:outline-none transition-all duration-200 ${
              showPersonalize
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="p-4 flex flex-col gap-4" role="none">
              {/* Dark mode toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-block w-[50px] h-6">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const isDark = e.target.checked;
                      document.body.classList.toggle("dark-mode", isDark);
                      localStorage.setItem("theme", isDark ? "dark" : "light");
                    }}
                    defaultChecked={localStorage.getItem("theme") === "dark"}
                    className="opacity-0 w-0 h-0 sr-only peer"
                  />
                  <div class="z-10000 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-base font-medium">🌙 Dark Mode</span>
              </div>

              {/* Font size options */}
                <div className="flex justify-center w-15 gap-2 px-2 py-2 rounded-lg shadow-inner">
                  {[
                    { size: "font-small", label: "A", textSize: "text-sm" },
                    { size: "font-medium", label: "A", textSize: "text-base" },
                    { size: "font-large", label: "A", textSize: "text-lg" },
                  ].map(({ size, label, textSize }) => (
                    <button
                      key={size}
                      onClick={() => {
                        document.documentElement.classList.remove("font-small", "font-medium", "font-large");
                        document.documentElement.classList.add(size);
                        setActiveFont(size);  // actualizează React state
                      }}
                      className={`px-3 py-1 rounded-md transition-all duration-200 font-semibold ${textSize} ${
                        activeFont === size
                          ? "bg-sky-500 text-white shadow"
                          : "bg-white text-gray-700 hover:bg-sky-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

            </div>
          </div>
        </li>

        {showPersonalize && (
          <aside className="personalize-aside">
            <div className="theme-switch-wrapper">
              <label className="theme-switch">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const isDark = e.target.checked;
                    document.body.classList.toggle("dark-mode", isDark);
                    localStorage.setItem("theme", isDark ? "dark" : "light");
                  }}
                  defaultChecked={localStorage.getItem("theme") === "dark"}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">🌙 Dark Mode</span>
            </div>

                  
            <div className="font-size-label">
              <button className="small-font" onClick={() => {
                document.documentElement.classList.remove("font-medium", "font-large");
                document.documentElement.classList.add("font-small");
              }}>A</button>

              <button className="medium-font" onClick={() => {
                document.documentElement.classList.remove("font-small", "font-large");
                document.documentElement.classList.add("font-medium");
              }}>A</button>

              <button className="large-font" onClick={() => {
                document.documentElement.classList.remove("font-small", "font-medium");
                document.documentElement.classList.add("font-large");
              }}>A</button>
            </div>

          </aside>
        )}


      </ul>
    </header>
  );
}

export default Header;
