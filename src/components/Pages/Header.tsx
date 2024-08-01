import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaSun, FaMoon, FaCloud } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";
import logo from "../../../public/RecursosWeb/img/Logo/Logo-Gloove.webp";

const THEMES = ["light", "dark", "system"];

const navItems = [
  { title: "Huéspedes", label: "huespedes", url: "#huespedes" },
  { title: "Propietarios", label: "propietarios", url: "#propietarios" },
  { title: "Inmobiliaria", label: "inmobiliaria", url: "#inmobiliaria" },
  { title: "Experiencias", label: "experiencias", url: "#experiencias" },
  { title: "Contacto", label: "contacto", url: "#contacto" },
  { title: "Blog", label: "blog", url: "#blog" },
];

const Header = () => {
  const { mode, toggleMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sections = document.querySelectorAll("section, div[id=inicio]");
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    });

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full bg-glooveSecondary-light text-glooveText shadow-md z-50 transition-colors duration-500 ${
        mode === "dark" ? "dark:bg-dark-background dark:text-dark-text" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <motion.img
            src={logo}
            alt="Gloove Logo"
            className="h-12"
            whileHover={{ scale: 1.1, rotate: 3 }}
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className={`relative flex items-center space-x-2 px-3 py-2 transition ${
                activeSection === link.label
                  ? "bg-gloovePrimary-dark text-white rounded shadow-md"
                  : "hover:bg-gloovePrimary-light hover:text-gloovePrimary-dark hover:rounded"
              }`}
              style={{ textTransform: "uppercase" }}
            >
              <span>{link.title}</span>
            </a>
          ))}
          <Link to="/login" className="ml-4">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              }}
              className="bg-gloovePrimary-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              INICIAR SESIÓN
            </motion.button>
          </Link>
          <div className="relative ml-4">
            <button
              className="flex items-center justify-center rounded-full p-2 bg-glooveSecondary-light text-gloovePrimary hover:bg-glooveSecondary-dark hover:text-glooveSecondary-light transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {mode === "light" && <FaSun />}
              {mode === "dark" && <FaMoon />}
              {mode === "system" && <FaCloud />}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-md shadow-lg z-20">
                {THEMES.map((theme) => (
                  <div
                    key={theme}
                    onClick={() => toggleMode(theme)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gloovePrimary focus:outline-none"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-glooveSecondary-light">
          <nav className="flex flex-col items-center py-4 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="text-gloovePrimary hover:text-gloovePrimary-dark transition duration-200"
                onClick={() => setMenuOpen(false)}
                style={{ textTransform: "uppercase" }}
              >
                {item.title}
              </a>
            ))}
          </nav>
          <Link to="/login" className="w-full flex justify-center">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              }}
              className="bg-gloovePrimary-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300 mt-4"
            >
              INICIAR SESIÓN
            </motion.button>
          </Link>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
