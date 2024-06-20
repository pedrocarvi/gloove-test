// src/routes.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Profile from "./Pages/Profile.jsx";
import Properties from "./Pages/Properties.jsx";
import Reservations from "./Pages/Reservations.jsx";
import Incidents from "./Pages/Incidents.jsx";
import Help from "./Pages/Help.jsx";
import Chat from "./Pages/Chat.jsx";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";

//hola
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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
