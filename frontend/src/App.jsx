import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import FriendDashboard from "./Pages/FriendDashboard.jsx";
// import FriendPage from "./Pages/FriendPage.jsx";
import HomeFeed from "./Pages/HomeFeed.jsx";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/friend/:friendId" element={<FriendDashboard />} />
        <Route path="/home" element={<HomeFeed />} /> 
      </Routes>
    </Router>
  );
};

export default App;
