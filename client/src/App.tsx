import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("username");
  });
  const [email, setEmail] = useState<string | null>(() => {
    return localStorage.getItem("email"); // Retrieve email from localStorage
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userEmail = localStorage.getItem("email");

    if (token && username && userEmail) {
      setIsAuthenticated(true);
      setUser(username);
      setEmail(userEmail);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setEmail(null);
    }
  }, []);

  const handleLogin = (username: string, email: string, token: string) => {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email); // Store the email in localStorage
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(username);
    setEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email"); // Remove email from localStorage
    setIsAuthenticated(false);
    setUser(null);
    setEmail(null);
  };

  return (
    <Router>
      <div className="bg-background min-h-screen text-primaryText flex flex-col">
        <Header isAuthenticated={isAuthenticated} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/edit-profile"
              element={
                isAuthenticated ? <EditProfile /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
