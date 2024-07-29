// src/context/DarkModeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface DarkModeContextProps {
  mode: string;
  toggleMode: (newMode: string) => void;
}

// Crear el contexto
const DarkModeContext = createContext<DarkModeContextProps>({
  mode: "system",
  toggleMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState("system");

  useEffect(() => {
    const updateMode = () => {
      if (mode === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.documentElement.classList.toggle("dark", systemPrefersDark);
      } else {
        document.documentElement.classList.toggle("dark", mode === "dark");
      }
    };
    updateMode();

    if (mode === "system") {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", updateMode);
    }

    return () => {
      if (mode === "system") {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .removeEventListener("change", updateMode);
      }
    };
  }, [mode]);

  const toggleMode = (newMode: string) => setMode(newMode);

  return (
    <DarkModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
