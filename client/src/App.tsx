import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import SinglePost from "./pages/SinglePost";
import WritePost from "./pages/WritePost";
import EditPost from "./pages/EditPost";
import AllUserPosts from "./pages/AllUserPosts";
import AdminDashboard from "./pages/AdminDashboard";
import MagicLogin from "./pages/MagicLogin";
import OAuthSuccess from "./pages/OAuthSuccess";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture: string;
}

interface TokenValidationResponse {
  valid: boolean;
  user: User;
}

const AppRoutes: React.FC<{
  isAuthenticated: boolean;
  user: User | null;
  handleLogin: (user: User, token: string) => void;
  handleLogout: () => void;
}> = ({ isAuthenticated, user, handleLogin, handleLogout }) => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login
              onLogin={(username, email, firstName, role, token) =>
                handleLogin(
                  {
                    _id: "",
                    username,
                    email,
                    firstName,
                    lastName: "",
                    role,
                    profilePicture: "",
                  },
                  token
                )
              }
            />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/magic-login"
        element={
          <MagicLogin
            onLogin={(username, email, firstName, role, token) =>
              handleLogin(
                {
                  _id: "",
                  username,
                  email,
                  firstName,
                  lastName: "",
                  role,
                  profilePicture: "",
                },
                token
              )
            }
          />
        }
      />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
      <Route
        path="/edit-profile"
        element={
          isAuthenticated ? (
            <EditProfile />
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
      <Route
        path="/write-post"
        element={
          isAuthenticated ? (
            <WritePost />
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
      <Route
        path="/edit-post/:id"
        element={
          isAuthenticated ? (
            <EditPost />
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
      <Route
        path="/all-user-posts"
        element={
          isAuthenticated ? (
            <AllUserPosts />
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
      <Route path="/post/:id" element={<SinglePost />} />
      <Route
        path="/admin-dashboard"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              state={{ from: location }}
              replace
            />
          )
        }
      />
      <Route
        path="*"
        element={<div>404 - Page not found. Please check your URL.</div>}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="bg-background min-h-screen text-primaryText flex flex-col">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="flex-grow">
          <AppRoutes
            isAuthenticated={isAuthenticated}
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
