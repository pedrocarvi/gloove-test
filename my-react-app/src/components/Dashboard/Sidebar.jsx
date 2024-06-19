import { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  ClipboardListIcon,
  CalendarIcon,
  ExclamationIcon,
  QuestionMarkCircleIcon,
  ChatIcon,
} from "@heroicons/react/outline";

const Sidebar = () => {
  const [active, setActive] = useState("home");

  const handleSetActive = (section) => {
    setActive(section);
  };

  const menuItems = [
    { name: "Home", icon: HomeIcon, section: "home" },
    { name: "Profile", icon: UserIcon, section: "profile" },
    { name: "Properties", icon: ClipboardListIcon, section: "properties" },
    { name: "Reservations", icon: CalendarIcon, section: "reservations" },
    { name: "Incidents", icon: ExclamationIcon, section: "incidents" },
    { name: "Help", icon: QuestionMarkCircleIcon, section: "help" },
    { name: "Chat", icon: ChatIcon, section: "chat" },
  ];

  return (
    <div className="h-screen bg-teal-700 text-white flex flex-col items-center py-10">
      <img src="/Logo-Gloove.webp" alt="Gloove Logo" className="w-32 mb-10" />
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.section}
            className={`flex items-center px-4 py-2 w-full text-left transition-colors duration-200 hover:bg-teal-600 ${
              active === item.section ? "bg-teal-800" : ""
            }`}
            onClick={() => handleSetActive(item.section)}
          >
            <item.icon className="w-6 h-6 mr-2" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
