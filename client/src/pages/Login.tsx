import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaGoogle, FaFacebookF, FaEnvelope } from "react-icons/fa";

interface LoginProps {
  onLogin: (
    username: string,
    email: string,
    firstName: string,
    role: string,
    token: string
  ) => void;
}

interface LoginResponse {
  user: {
    username: string;
    email: string;
    firstName: string;
    role: string;
  };
  token: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "email" ? value.toLowerCase().replace(/\s/g, "") : value;
    setFormData({ ...formData, [name]: formattedValue });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          usernameOrEmail: formData.email,
          password: formData.password,
        }
      );

      const { username, email, firstName, role } = response.data.user;
      const { token } = response.data;

      onLogin(username, email, firstName, role, token);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const handleMagicLinkLogin = async () => {
    setError(null);
    setSuccess(null);

    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/send-magic-link`,
        { email: formData.email }
      );
      setSuccess("Magic link sent! Check your email.");
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    const redirect = encodeURIComponent(redirectPath);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google?redirect=${redirect}`;
  };

  const handleFacebookLogin = () => {
    const redirect = encodeURIComponent(redirectPath);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook?redirect=${redirect}`;
  };

  return (
    <div className="container p-7 py-10 flex items-center justify-center bg-background min-h-screen">
      <div className="bg-background p-8 rounded-lg shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-xl font-bold text-center text-primaryText">
          Welcome Back
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {!showForm && (
          <div className="space-y-4">
            <button
              className="w-full border border-gray-500 rounded-full py-2 flex items-center justify-center text-secondaryText hover:bg-gray-800 hover:text-white transition"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="mr-3" />
              Sign in with Google
            </button>
            <button
              className="w-full border border-gray-500 rounded-full py-2 flex items-center justify-center text-secondaryText hover:bg-gray-800 hover:text-white transition"
              onClick={handleFacebookLogin}
            >
              <FaFacebookF className="mr-3" />
              Sign in with Facebook
            </button>
            <button
              className="w-full border border-gray-500 rounded-full py-2 flex items-center justify-center text-secondaryText hover:bg-gray-800 hover:text-white transition"
              onClick={() => setShowForm(true)}
            >
              <FaEnvelope className="mr-3" />
              Continue with Email
            </button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-secondaryText">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-secondaryText"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-secondaryText"
              >
                Password
              </label>
              <div className="eyecomp flex items-center border rounded-md overflow-hidden">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-none text-secondaryText focus:outline-none"
                  required
                />
                <div
                  className="px-3 flex items-center cursor-pointer bg-gray-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-gray-500" />
                  ) : (
                    <AiFillEye className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primaryButton text-primaryButtonText py-2 rounded-md font-medium hover:bg-buttonHover transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleMagicLinkLogin}
              className="w-full mt-2 border border-gray-500 text-secondaryText py-2 rounded-md hover:bg-gray-800 hover:text-white transition"
            >
              Send Magic Link
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-secondaryText">
          Don&apos;t have an account?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-blue-400 hover:underline"
          >
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
