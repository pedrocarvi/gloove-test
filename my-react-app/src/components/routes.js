// src/routes.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
// import Profile from "./components/Pages/Profile";
// import Properties from "./components/Pages/Properties";
// import Reservations from "./components/Pages/Reservations";
// import Incidents from "./components/Pages/Incidents";
// import Help from "./components/Pages/Help";
// import Chat from "./components/Pages/Chat";
// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/help" element={<Help />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
