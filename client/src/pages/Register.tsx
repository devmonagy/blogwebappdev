// client/src/pages/Register.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// Define the structure of the expected response data
interface RegisterResponse {
  message: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordStatus, setPasswordStatus] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect to /dashboard if the user is logged in
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      const formattedValue = value.toLowerCase().replace(/\s/g, "");
      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === "password") {
      setFormData({ ...formData, [name]: value });
      checkPasswordStrength(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);

    if (strength <= 1) {
      setPasswordStatus("Strength: Weak");
    } else if (strength === 2) {
      setPasswordStatus("Strength: Fair");
    } else if (strength === 3) {
      setPasswordStatus("Strength: Good");
    } else if (strength === 4) {
      setPasswordStatus("Strength: Strong");
    } else {
      setPasswordStatus("Strength: Very Strong");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
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
      setFormData({ username: "", email: "", password: "" });
      setPasswordStrength(0);
      setPasswordStatus("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to get color based on password strength
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

  return (
    <div className="h-full py-10 flex items-center justify-center bg-background">
      <div className="bg-background p-6 rounded-md shadow-md border border-gray-400 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Register
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300" htmlFor="password">
              Password
            </label>
            <div className="eyecomp flex items-center border rounded-md overflow-hidden">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border-none text-gray-700 focus:outline-none"
                required
              />
              <div
                className="h-full px-3 flex items-center cursor-pointer bg-gray-200"
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
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
