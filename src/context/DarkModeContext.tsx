import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FaSun, FaMoon, FaCloud } from "react-icons/fa";

// Interfaz del contexto
interface DarkModeContextProps {
  mode: string;
  setMode: (newMode: string) => void;
}

// Crear el contexto con valores predeterminados
const DarkModeContext = createContext<DarkModeContextProps>({
  mode: "system",
  setMode: () => {},
});

// Proveedor del contexto para manejar el modo oscuro
export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState("light"); // Modo claro por defecto

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

  return (
    <DarkModeContext.Provider value={{ mode, setMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook para usar el modo oscuro en los componentes
export const useDarkMode = () => useContext(DarkModeContext);

// Componente ThemeToggle para cambiar entre modos
const ThemeToggle = () => {
  const { mode, setMode } = useDarkMode();

  const THEMES = ["light", "dark", "system"];

  return (
    <div className="relative">
      <button
        id="theme-toggle-btn"
        className="appearance-none border-none flex justify-center items-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
      >
        <span className="sr-only">Elige el tema</span>
        {mode === "light" && <FaSun />}
        {mode === "dark" && <FaMoon />}
        {mode === "system" && <FaCloud />}
      </button>
      <div
        id="themes-menu"
        className="absolute hidden top-12 right-0 text-sm p-1 min-w-[8rem] rounded-md border border-lightBorder bg-lightBackground dark:bg-darkBackground dark:border-darkBorder shadow-lg backdrop-blur-md"
      >
        <ul>
          {THEMES.map((theme) => (
            <li
              key={theme}
              onClick={() => setMode(theme)}
              className="themes-menu-option px-2 py-1.5 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded-sm transition-colors duration-200"
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThemeToggle;
