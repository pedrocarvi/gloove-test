import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  FaSun,
  FaMoon,
  FaCloud,
  FaUser,
  FaConciergeBell,
  FaBuilding,
  FaStar,
  FaHome,
  FaHandsHelping,
  FaBlog,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";
import logo from "../../../public/RecursosWeb/img/Logo/Logo-Gloove.webp";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navItems = [
  { title: "Inicio", label: "inicio", url: "inicio", icon: FaHome },
  { title: "Nosotros", label: "nosotros", url: "nosotros", icon: FaUser },
  {
    title: "Contacto",
    label: "contacto",
    url: "contacto",
    icon: FaHandsHelping,
  },
  { title: "Blog", label: "blog", url: "blog", icon: FaBlog },
];

const servicesSubmenu = [
  { title: "Huéspedes", url: "huespedes", icon: FaConciergeBell },
  { title: "Propietarios", url: "propietarios", icon: FaUser },
  { title: "Inmobiliaria", url: "inmobiliaria", icon: FaBuilding },
  { title: "Experiencias", url: "experiencias", icon: FaStar },
];

const THEMES = ["light", "dark", "system"];

const Header = () => {
  const { mode, toggleMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [submenuTimeout, setSubmenuTimeout] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const sections = document.querySelectorAll("section[id], div[id=inicio]");
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
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full bg-glooveSecondary-light text-glooveText shadow-md z-50 transition-colors duration-500 ${
        mode === "dark" ? "dark:bg-dark-background dark:text-dark-text" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <RouterLink to="/" className="flex items-center space-x-2">
          <motion.img
            src={logo}
            alt="Gloove Logo"
            className="h-12"
            whileHover={{ scale: 1.1, rotate: 3 }}
          />
        </RouterLink>
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
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
                <link.icon className="mr-2" />
                <span>{link.title}</span>
              </ScrollLink>
              {link.label === "servicios" && servicesOpen && (
                <div className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20">
                  {servicesSubmenu.map(
                    (
                      subitem: {
                        title: string;
                        url: string;
                        icon: React.ElementType;
                      },
                      index: number
                    ) => (
                      <ScrollLink
                        key={index}
                        to={subitem.url}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="flex items-center px-4 py-2 text-gloovePrimary-dark hover:bg-gray-100 transition"
                      >
                        <subitem.icon className="mr-2" />
                        {subitem.title}
                      </ScrollLink>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <RouterLink to="/login" className="ml-4">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              }}
              className="flex items-center bg-gloovePrimary-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              <FaUser className="mr-2" />
              INICIAR SESIÓN
            </motion.button>
          </RouterLink>
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
        <motion.div
          className="md:hidden fixed inset-0 bg-glooveSecondary-light z-40 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto flex flex-col items-center py-4">
            <div className="w-full flex justify-between items-center px-4">
              <RouterLink to="/" className="flex items-center space-x-2">
                <motion.img
                  src={logo}
                  alt="Gloove Logo"
                  className="h-12"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                />
              </RouterLink>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gloovePrimary focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-4 w-full flex flex-col items-center space-y-2">
              {navItems.map((item, index) => (
                <ScrollLink
                  key={index}
                  to={item.url}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="w-full flex items-center justify-center text-gloovePrimary hover:text-gloovePrimary-dark transition duration-200 py-4 text-lg uppercase"
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="mr-2" />
                  {item.title}
                </ScrollLink>
              ))}
              {servicesSubmenu.map((subitem, index) => (
                <ScrollLink
                  key={index}
                  to={subitem.url}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="w-full flex items-center justify-center text-gloovePrimary hover:text-gloovePrimary-dark transition duration-200 py-4 text-lg uppercase"
                  onClick={() => setMenuOpen(false)}
                >
                  <subitem.icon className="mr-2" />
                  {subitem.title}
                </ScrollLink>
              ))}
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                className="w-full flex items-center justify-center bg-gloovePrimary-dark text-white font-bold py-3 mt-4 rounded-lg transition duration-300"
                onClick={() => setMenuOpen(false)}
              >
                <FaUser className="mr-2" />
                INICIAR SESIÓN
              </motion.button>
              <div className="mt-4 w-full flex justify-center space-x-4">
                <button
                  className="flex items-center justify-center rounded-full p-2 bg-glooveSecondary-light text-gloovePrimary hover:bg-glooveSecondary-dark hover:text-glooveSecondary-light transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {mode === "light" && <FaSun />}
                  {mode === "dark" && <FaMoon />}
                  {mode === "system" && <FaCloud />}
                </button>
                {dropdownOpen && (
                  <div className="absolute top-16 py-2 w-32 bg-white rounded-md shadow-lg z-20">
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
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
