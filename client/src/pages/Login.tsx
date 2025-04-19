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
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false);

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

  // ⚠️ Commented out Google/Facebook login buttons
  // const handleGoogleLogin = () => {
  //   const redirect = encodeURIComponent(redirectPath);
  //   window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google?redirect=${redirect}`;
  // };

  // const handleFacebookLogin = () => {
  //   const redirect = encodeURIComponent(redirectPath);
  //   window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook?redirect=${redirect}`;
  // };

  return (
    <div className="container px-4 pt-10 pb-8 flex items-center justify-center bg-background min-h-screen">
      <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-xl font-bold text-center text-primaryText">
          Welcome Back
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form
          onSubmit={
            showPasswordField ? handleSubmit : (e) => e.preventDefault()
          }
          className="space-y-4"
        >
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

          {!showPasswordField ? (
            <>
              {" "}
              <span className="text-sm text-secondaryText">
                Want to sign in with your password?{" "}
              </span>
              <button
                type="button"
                onClick={() => setShowPasswordField(true)}
                className="text-blue-400 text-sm hover:underline"
              >
                Click here
              </button>
              <span className="text-sm text-secondaryText">.</span>
              <button
                type="button"
                onClick={handleMagicLinkLogin}
                className="w-full mt-2 bg-primaryButton text-primaryButtonText py-2 rounded-md font-medium hover:bg-buttonHover transition"
              >
                Send Magic Link
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </form>

        <p className="text-sm text-center text-secondaryText mt-4">
          Don't have an account?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-blue-400 hover:underline"
          >
            Create One
          </Link>
        </p>

        <p className="text-xxs text-center text-gray-500 mt-2">
          This site is in soft launch mode 🚀
          <br /> By continuing, you agree to our{" "}
          <Link
            to="/terms"
            className="underline text-blue-400 hover:text-blue-300"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline text-blue-400 hover:text-blue-300"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
