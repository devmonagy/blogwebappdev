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
import CompleteProfile from "./pages/CompleteProfile";
import axios from "axios";

// 👇 fix: username can be optional to match backend response
interface User {
  _id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profilePicture?: string;
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
  handleProfileUpdate: (updated: Partial<User>) => void;
}> = ({
  isAuthenticated,
  user,
  handleLogin,
  handleLogout,
  handleProfileUpdate,
}) => {
  const location = useLocation();
  const profileIncomplete =
    isAuthenticated && (!user?.firstName?.trim() || !user?.lastName?.trim());

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
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route path="/register" element={<Register />} />

      <Route
        path="/magic-login"
        element={<MagicLogin onLogin={handleLogin} />}
      />

      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      <Route
        path="/complete-profile"
        element={
          isAuthenticated ? (
            <CompleteProfile onProfileUpdate={handleProfileUpdate} />
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            profileIncomplete ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <Dashboard onLogout={handleLogout} />
            )
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />

      <Route
        path="/edit-profile"
        element={
          isAuthenticated ? (
            profileIncomplete ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <EditProfile />
            )
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />

      <Route
        path="/write-post"
        element={
          isAuthenticated ? (
            profileIncomplete ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <WritePost />
            )
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />

      <Route
        path="/edit-post/:id"
        element={
          isAuthenticated ? (
            profileIncomplete ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <EditPost />
            )
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />

      <Route
        path="/all-user-posts"
        element={
          isAuthenticated ? (
            profileIncomplete ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <AllUserPosts />
            )
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
            profileIncomplete ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <AdminDashboard />
            )
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

  const [loadingUser, setLoadingUser] = useState(true);

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

  const handleProfileUpdate = (updated: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updated };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await axios.post<TokenValidationResponse>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/validate-token`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.valid) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      } finally {
        setLoadingUser(false);
      }
    };

    validateUser();
  }, []);

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white text-xl">
        Loading...
      </div>
    );
  }

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
            handleProfileUpdate={handleProfileUpdate}
          />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
