// src/routes.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.js";
import Profile from "./Pages/Profile";
import Properties from "./Pages/Properties";
import Reservations from "./Pages/Reservations";
import Incidents from "./Pages/Incidents";
import Help from "./Pages/Help";
import Chat from "./Pages/Chat";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/help" element={<Help />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
