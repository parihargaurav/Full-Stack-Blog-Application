import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const html = document.documentElement;

    html.classList.remove("light", "dark");
    html.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prevTheme) =>
      prevTheme === "light" ? "dark" : "light"
    );
  }

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}