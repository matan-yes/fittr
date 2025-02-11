import React, { createContext, useState, useContext } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";


const lightTheme = {
    background: "#ffffff",
    text: "#000000",
  };
  
const darkTheme = {
    background: "#121212",
    text: "#ffffff",
  };

const ThemeContext = createContext();


export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
  
    const toggleTheme = () => {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <StyledThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          {children}
        </StyledThemeProvider>
      </ThemeContext.Provider>
    );
  };

  export const useTheme = () => useContext(ThemeContext);
  