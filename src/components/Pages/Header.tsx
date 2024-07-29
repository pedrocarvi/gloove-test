import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  PhoneIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import SunIcon from "../icons/SunIcon";
import MoonIcon from "../icons/MoonIcon";
import SystemIcon from "../icons/SystemIcon";
import { useDarkMode } from "../../context/DarkModeContext";
import { motion } from "framer-motion";
import logo from "../../../public/RecursosWeb/img/Logo/Logo-Gloove.webp";
import { FaHotel } from "react-icons/fa";

const THEMES = ["light", "dark", "system"];

const navItems = [
  { title: "Inicio", label: "inicio", url: "#inicio", icon: HomeIcon },
  {
    title: "Servicios",
    label: "servicios",
    url: "#servicios",
    icon: UserIcon,
    subMenu: [
      { title: "Propietarios", url: "#propietarios", icon: BriefcaseIcon },
      { title: "Reservas", url: "#reservas", icon: FaHotel },
      { title: "Inmobiliaria", url: "#inmobiliaria", icon: BuildingOfficeIcon },
      { title: "Experiencias", url: "#experiencias", icon: SparklesIcon },
    ],
  },
  { title: "Contacto", label: "contacto", url: "#contacto", icon: PhoneIcon },
  { title: "Blog", label: "blog", url: "#blog", icon: BookOpenIcon },
];

const Header: React.FC = () => {
  const { mode, toggleMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleModeChange = (newMode: string) => {
    toggleMode(newMode);
    setDropdownOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const themesMenu = document.getElementById("themes-menu");
      const themeToggleBtn = document.getElementById("theme-toggle-btn");
      if (
        themesMenu &&
        themeToggleBtn &&
        !themesMenu.contains(event.target as Node) &&
        !themeToggleBtn.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      className={`fixed top-0 left-0 w-full bg-white text-[#146B79] shadow-lg z-50 transition-colors duration-500 ${
        mode === "dark" ? "dark:bg-gray-900 dark:text-white" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <motion.img
            src={logo}
            alt="Gloove Logo"
            className="h-16"
            whileHover={{ scale: 1.1, rotate: 3 }}
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((link) => (
            <div key={link.label} className="relative">
              <a
                href={link.url}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative flex items-center space-x-2 px-3 py-2 transition ${
                  activeSection === link.label || hoveredLink === link.label
                    ? "text-white bg-[#146B79] rounded shadow-md"
                    : "text-[#146B79] hover:text-white hover:bg-[#146B79] hover:rounded"
                } ${
                  hoveredLink && hoveredLink !== link.label
                    ? "opacity-50"
                    : "opacity-100"
                } ${
                  mode === "dark"
                    ? "dark:text-white dark:hover:bg-gray-700"
                    : ""
                }`}
                aria-label={link.label}
                onClick={() => link.subMenu && setServicesOpen(!servicesOpen)}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.title}</span>
              </a>
              {link.subMenu && servicesOpen && (
                <div className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                  {link.subMenu.map((subLink) => (
                    <a
                      key={subLink.url}
                      href={subLink.url}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      {subLink.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/login" className="ml-4">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              }}
              className="bg-[#146B79] text-white font-bold py-2 px-6 rounded transition duration-300"
            >
              Iniciar Sesión
            </motion.button>
          </Link>
          <div className="relative ml-4">
            <button
              id="theme-toggle-btn"
              className="appearance-none border-none flex hover:scale-110 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Elige el tema</span>
              <motion.div
                animate={{ rotate: mode === "light" ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {mode === "light" && (
                  <SunIcon className="theme-toggle-icon size-5 text-yellow-500" />
                )}
                {mode === "dark" && (
                  <MoonIcon className="theme-toggle-icon size-5 text-gray-200" />
                )}
                {mode === "system" && (
                  <SystemIcon className="theme-toggle-icon size-5 text-gray-500" />
                )}
              </motion.div>
            </button>
            <div
              id="themes-menu"
              className={`absolute ${
                dropdownOpen ? "inline" : "hidden"
              } scale-80 top-8 right-0 text-sm p-1 min-w-[8rem] rounded-md border border-gray-100 bg-white/90 dark:bg-gray-900/90 dark:border-gray-500/20 shadow-[0_3px_10px rgb(0,0,0,0.2)] backdrop-blur-md`}
            >
              <ul>
                {THEMES.map((theme) => (
                  <li
                    key={theme}
                    className="themes-menu-option px-2 py-1.5 cursor-default hover:bg-neutral-400/40 dark:hover:bg-gray-500/50 rounded-sm"
                    onClick={() => handleModeChange(theme)}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-[#146B79] hover:text-white transition"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div
          className={`md:hidden ${
            mode === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-[#146B79]"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((link) => (
              <a
                key={link.label}
                href={link.url}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                  activeSection === link.label || hoveredLink === link.label
                    ? "text-white bg-[#146B79] rounded shadow-md"
                    : "text-[#146B79] hover:text-white hover:bg-[#146B79] hover:rounded"
                } ${
                  hoveredLink && hoveredLink !== link.label
                    ? "opacity-50"
                    : "opacity-100"
                } ${
                  mode === "dark"
                    ? "dark:text-white dark:hover:bg-gray-700"
                    : ""
                }`}
                onClick={toggleMenu}
              >
                <link.icon className="h-5 w-5 mr-2 inline" />
                {link.title}
              </a>
            ))}
            <Link
              to="/login"
              className="text-white bg-[#146B79] hover:bg-[#125e67] hover:text-white block w-full px-3 py-2 rounded-md text-base font-medium transition duration-300 transform hover:scale-105"
              onClick={toggleMenu}
            >
              <span className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </span>
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
