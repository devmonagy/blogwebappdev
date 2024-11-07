// client/src/App.tsx
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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setIsAuthenticated(true);
      setUser(username);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Function to handle user login
  const handleLogin = (username: string, token: string) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(username);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="bg-background min-h-screen text-primaryText flex flex-col">
        <Header isAuthenticated={isAuthenticated} />
        <main className="flex-grow">
          <Routes>
            {/* Ensure Home does not require the onLogin prop */}
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
