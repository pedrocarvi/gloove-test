import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaHome,
  FaHandsHelping,
  FaBlog,
  FaConciergeBell,
  FaBuilding,
  FaStar,
  FaDesktop, // Nuevo ícono para el modo sistema
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import './0Changes.css';

// Elementos de navegación
const navItems = [
  { title: "Inicio", label: "inicio", url: "inicio", icon: FaHome },
  {
    title: "Servicios",
    label: "servicios",
    url: "servicios",
    icon: FaConciergeBell,
  },
  { title: "Nosotros", label: "nosotros", url: "nosotros", icon: FaUser },
  {
    title: "Contacto",
    label: "contacto",
    url: "contacto",
    icon: FaHandsHelping,
  },
  { title: "Blog", label: "blog", url: "https://gloove.me/blog/", icon: FaBlog },
];

// Submenú de servicios
const servicesSubmenu = [
  { title: "Huéspedes", url: "huespedes", icon: FaConciergeBell },
  { title: "Propietarios", url: "propietarios", icon: FaUser },
  { title: "Inmobiliaria", url: "inmobiliaria", icon: FaBuilding },
  { title: "Experiencias", url: "experiencias", icon: FaStar },
];

const THEMES = ["light", "dark", "system"];

const Header = () => {
  const { mode, setMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTransparent, setIsTransparent] = useState(true);
  const [submenuTimeout, setSubmenuTimeout] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setIsTransparent(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Aquí se activa la sección actual
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px", // Puedes ajustar esto, por ejemplo, "0px 0px -50% 0px"
      threshold: 0.3, // Puedes probar valores como 0.5 o 0.7 para diferentes sensibilidades
    });

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const getNavItemClass = (label: string) => {
    return activeSection === label
      ? "bg-gloovePrimary-dark text-white rounded shadow-md"
      : "hover:bg-gloovePrimary-light hover:text-gloovePrimary-dark hover:rounded";
  };

  const handleMouseEnter = () => {
    if (submenuTimeout) clearTimeout(submenuTimeout);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setServicesOpen(false), 300);
    setSubmenuTimeout(timeout as unknown as number);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 backdrop-blur-md ${
        isTransparent
          ? "bg-transparent text-white"
          : "bg-glooveSecondary-light text-glooveText dark:bg-dark-background dark:text-dark-text"
      } ${scrollPosition > 50 ? "shadow-lg" : "shadow-none"}`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <RouterLink to="/" className="flex items-center space-x-2">
          <motion.img
            src="/RecursosWeb/img/Logo/Logo-Gloove.webp" // Ruta relativa desde la raíz
            alt="Logo"
            className={`h-12 ${
              isTransparent ? "filter invert brightness-0" : ""
            }`}
            whileHover={{ scale: 1.1, rotate: 3 }}
          />
        </RouterLink>

        {/* Botón de menú para móviles */}
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

        {/* Menú en dispositivos grandes */}
        <nav className="hidden md:flex items-center space-x-8 navbar">
        {navItems.map((link) => (
            <div
              key={link.label}
              className="relative nav-item"
              onMouseEnter={
                link.label === "servicios" ? handleMouseEnter : undefined
              }
              onMouseLeave={
                link.label === "servicios" ? handleMouseLeave : undefined
              }
            >
              {link.url.startsWith("http") ? ( // Verifica si es una URL externa
                <a
                  href={link.url}
                  target="_blank" // Abre en una nueva pestaña
                  rel="noopener noreferrer"
                  className={`relative flex items-center space-x-2 px-3 py-2 transition ${getNavItemClass(
                    link.label
                  )}`}
                  style={{ textTransform: "uppercase" }}
                >
                  <motion.div
                    className={isTransparent ? "text-white" : ""}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <link.icon className="mr-2" />
                  </motion.div>
                  <span>{link.title}</span>
                </a>
              ) : (
                <ScrollLink
                  to={link.url}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className={`relative flex items-center space-x-2 px-3 py-2 transition ${getNavItemClass(
                    link.label
                  )}`}
                  style={{ textTransform: "uppercase" }}
                >
                  <motion.div
                    className={isTransparent ? "text-white" : ""}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <link.icon className="mr-2" />
                  </motion.div>
                  <span>{link.title}</span>
                </ScrollLink>
              )}
              {link.label === "servicios" && servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: servicesOpen ? 1 : 0,
                    height: servicesOpen ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 mt-2 py-2 w-48 bg-white dark:bg-dark-background rounded-md shadow-lg z-20 overflow-hidden"
                >
                  {servicesSubmenu.map(
                    (subitem: {
                      title: string;
                      url: string;
                      icon: React.ElementType;
                    }) => (
                      <ScrollLink
                        key={subitem.url}
                        to={subitem.url}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="flex items-center px-4 py-2 text-gloovePrimary-dark dark:text-lightText hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <subitem.icon className="mr-2" />
                        {subitem.title}
                      </ScrollLink>
                    )
                  )}
                </motion.div>
              )}
            </div>
          ))}
          <RouterLink to="/login" className="ml-4">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
                filter: "brightness(1.2)",
                transition: { duration: 0.5 },
              }}
              initial={{ scale: 1, filter: "brightness(1)" }}
              className="flex items-center bg-gradient-to-r from-gloovePrimary via-gloovePrimary-dark to-glooveAccent text-white font-bold py-3 px-8 rounded-full transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <FaUser className="mr-2 text-xl" />
              INICIAR SESIÓN
            </motion.button>
          </RouterLink>

          {/* <div className="relative ml-4">
            <button
              className={`flex items-center justify-center rounded-full p-2 ${
                isTransparent
                  ? "bg-transparent text-white border-white border-2"
                  : "bg-glooveSecondary-light dark:bg-dark-secondary hover:bg-glooveSecondary-dark hover:text-glooveSecondary-light"
              } transition-colors`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {mode === "light" && <FaSun />}
              {mode === "dark" && <FaMoon />}
              {mode === "system" && <FaDesktop />}{" "}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-32 bg-white text-black dark:bg-dark-background rounded-md shadow-lg z-20">
                {THEMES.map((theme) => (
                  <div
                    key={theme}
                    onClick={() => setMode(theme)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </nav>
      </div>

      {/* Menú desplegable para móviles */}
      {menuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-glooveSecondary-light dark:bg-dark-background z-40 h-screen flex flex-col justify-center items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-gloovePrimary focus:outline-none"
          >
            <XMarkIcon className="h-8 w-8 hover:text-gloovePrimary-dark transition-colors duration-200 ease-in-out transform hover:scale-110" />
          </button>
          <nav className="w-full flex flex-col items-center space-y-6">
            {navItems.map((item, index) => (
              <ScrollLink
                key={index}
                to={item.url}
                smooth={true}
                offset={-70}
                duration={500}
                className="w-full flex items-center justify-center text-gloovePrimary dark:text-white hover:text-gloovePrimary-dark dark:hover:text-gloovePrimary-light transition duration-300 py-4 text-lg uppercase transform hover:scale-105"
                onClick={() => setMenuOpen(false)}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mr-2"
                >
                  <item.icon className="text-2xl" />
                </motion.div>
                {item.title}
              </ScrollLink>
            ))}
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
              }}
              className="w-full max-w-xs flex items-center justify-center bg-gradient-to-r from-gloovePrimary via-gloovePrimary-dark to-glooveAccent text-white font-bold py-3 mt-4 rounded-full transition duration-300 hover:scale-105 animate-pulse"
              onClick={() => setMenuOpen(false)}
            >
              <FaUser className="mr-2 text-xl" />
              INICIAR SESIÓN
            </motion.button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
