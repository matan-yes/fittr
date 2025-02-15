import React, { createContext, useState, useContext } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import bgImageLight from '/Users/matanyes/personal-dev/fittr/src/fittr_transparent.png';
import bgImageDarkMode from '/Users/matanyes/personal-dev/fittr/src/fittr_dark_mode.png';


const lightTheme = {
    background: "#ffffff",
    text: "#000000",
    url: bgImageLight
  };
  
const darkTheme = {
    background: "#121212",
    text: "#ffffff",
    url: bgImageDarkMode
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
  