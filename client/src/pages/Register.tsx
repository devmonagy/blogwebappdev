import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaGoogle, FaFacebookF, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";

interface RegisterResponse {
  message: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showForm, setShowForm] = useState(false);
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
    switch (strength) {
      case 1:
        setPasswordStatus("Strength: Weak");
        break;
      case 2:
        setPasswordStatus("Strength: Fair");
        break;
      case 3:
        setPasswordStatus("Strength: Good");
        break;
      case 4:
        setPasswordStatus("Strength: Strong");
        break;
      default:
        setPasswordStatus("Strength: Very Strong");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (passwordStrength < 4) {
      setError("Please set a stronger password.");
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        formData
      );
      setSuccess(response.data.message);
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
      const response = await axios.post<RegisterResponse>(
        `${process.env.REACT_APP_BACKEND_URL}/auth/magic-register`,
        { email: formData.email }
      );
      setSuccess(response.data.message || "Magic link sent! Check your email.");
      setFormData({ email: "", password: "" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send magic link.");
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-green-700";
      default:
        return "bg-gray-300";
    }
  };

  const handleGoogleRegister = () => {
    const redirect = encodeURIComponent(redirectPath);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google?redirect=${redirect}`;
  };

  const handleFacebookRegister = () => {
    const redirect = encodeURIComponent(redirectPath);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook?redirect=${redirect}`;
  };

  return (
    <div className="container p-7 py-10 flex items-center justify-center bg-background min-h-screen">
      <div className="bg-background p-8 rounded-lg shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-xl font-bold text-center text-primaryText">
          Join Blogwebapp
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {!showForm && (
          <div className="space-y-4">
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
          <form
            onSubmit={
              showPasswordField
                ? handlePasswordSubmit
                : (e) => e.preventDefault()
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
                <button
                  type="button"
                  onClick={() => setShowPasswordField(true)}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Want to set a password now? Click here.
                </button>
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
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                    }}
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
        )}

        <p className="mt-4 text-center text-secondaryText">
          Already a member?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
