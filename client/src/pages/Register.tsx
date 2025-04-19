import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaGoogle, FaFacebookF, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";

interface RegisterResponse {
  message: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordStatus, setPasswordStatus] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
    setPasswordStatus(
      ["Strength: Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"][
        strength
      ] || ""
    );
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (passwordStrength < 4) {
      setError("Please set a stronger password.");
      return;
    }

    try {
      const res = await axios.post<RegisterResponse>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        formData
      );
      setSuccess(res.data.message);
      setFormData({ email: "", password: "" });
      setPasswordStrength(0);
      setPasswordStatus("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  const handleMagicLinkRegister = async () => {
    setSuccess(null);
    setError(null);

    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      const res = await axios.post<RegisterResponse>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/magic-register`,
        { email: formData.email }
      );
      setSuccess(res.data.message || "Magic link sent! Check your email.");
      setFormData({ email: "", password: "" });
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const getStrengthColor = () => {
    return (
      [
        "bg-gray-300",
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-green-700",
      ][passwordStrength] || "bg-gray-300"
    );
  };

  // ⚠️ Commented out social buttons temporarily
  // const handleGoogleRegister = () => {
  //   window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  // };

  // const handleFacebookRegister = () => {
  //   window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook`;
  // };

  return (
    <div className="container px-4 pt-10 pb-8 flex items-center justify-center bg-background min-h-screen">
      <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-xl font-bold text-center text-primaryText">
          Join Blogwebapp
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {/* ⚠️ Commented out social login buttons for now */}
        {/* <div className="space-y-4">
          <button
            className="w-full border border-gray-500 rounded-full py-2 flex items-center justify-center text-secondaryText hover:bg-gray-800 hover:text-white transition"
            onClick={handleGoogleRegister}
          >
            <FaGoogle className="mr-3" />
            Continue with Google
          </button>
          <button
            className="w-full border border-gray-500 rounded-full py-2 flex items-center justify-center text-secondaryText hover:bg-gray-800 hover:text-white transition"
            onClick={handleFacebookRegister}
          >
            <FaFacebookF className="mr-3" />
            Continue with Facebook
          </button>
        </div> */}

        <form
          onSubmit={
            showPasswordField ? handlePasswordSubmit : (e) => e.preventDefault()
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
              <span className="text-sm text-secondaryText">
                Want to set a password now?{" "}
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
                onClick={handleMagicLinkRegister}
                className="w-full mt-2 bg-primaryButton text-primaryButtonText py-2 rounded-md font-medium hover:bg-buttonHover transition"
              >
                Register with Magic Link
              </button>
            </>
          ) : (
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
              <div className="h-2 mt-2 w-full rounded-full bg-gray-300">
                <div
                  className={`h-full rounded-full ${getStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              {formData.password && (
                <p className="mt-2 text-sm text-gray-300">{passwordStatus}</p>
              )}
              <button
                type="submit"
                className="mt-4 w-full bg-primaryButton text-primaryButtonText py-2 rounded-md font-medium hover:bg-buttonHover transition"
              >
                Create Account
              </button>
            </div>
          )}
        </form>

        <p className="text-sm text-center text-secondaryText">
          Already a member?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-blue-400 hover:underline"
          >
            Sign in
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

export default Register;
