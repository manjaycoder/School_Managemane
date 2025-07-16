import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // General error message for invalid credentials
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear all previous errors
    setError("");
    setEmailError("");
    setUsernameError("");
    setPasswordError("");

    let hasErrors = false; // Flag to track if any validation errors occurred

    // --- Validation Logic ---

    // Username Validation
    if (!username) {
      setUsernameError("Username is required");
      hasErrors = true;
    } else if (username.length < 4) {
      setUsernameError("Username must be at least 4 characters");
      hasErrors = true;
    } else if (username.length > 20) {
      setUsernameError("Username must be less than 20 characters");
      hasErrors = true;
    }

    // Email Validation
    if (!email) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    } else if (!email.endsWith("@gmail.com")) {
      setEmailError("Only Gmail addresses are currently supported");
      hasErrors = true;
    }

    // Password Validation
    if (!password) {
      setPasswordError("Password is required");
      hasErrors = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasErrors = true;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      hasErrors = true;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      hasErrors = true;
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      setPasswordError("Password must contain at least one special character");
      hasErrors = true;
    }

    // If any validation errors, stop the submission process
    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    // --- Hardcoded Credential Check (for demonstration) ---
    // In a real application, you would send these credentials to a backend API for authentication.
    if (username === "manjay" && email === "Manjay.verma.coder@gmail.com" && password === "Manjay.verma1") {
      // Simulate API call delay for successful login
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin"); // Navigate on successful login
      }, 1500);
    } else {
      navigate("/confirm-branch")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h1 className="text-3xl font-bold text-white mt-4 font-['Inter'] select-none">
              Admin Portal
            </h1>
            <p className="text-blue-100 mt-2 select-none">
              School Management System
            </p>
          </div>

          <div className="pl-8 pr-8">
            {/* General Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-500 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-md font-medium text-gray-700 mb-1 select-none font-serif"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`block w-full px-4 py-3 rounded-lg border-b ${
                        usernameError ? "border-red-500" : "border-gray-300"
                      } placeholder-gray-400 focus:border-transparent ease-in-out transition-all duration-200`}
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError("");
                        setError(""); // Clear general error on input change
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {usernameError && (
                    <p className="mt-1 text-sm text-red-600">{usernameError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 select-none mb-1 font-serif"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`block w-full px-4 py-3 rounded-lg border-b ${
                        emailError ? "border-red-500" : "border-gray-300"
                      } placeholder-gray-400 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                        setError(""); // Clear general error on input change
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 select-none mb-1 font-serif"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={type}
                      required
                      className={`block w-full px-4 py-3 rounded-lg border-b ${
                        passwordError ? "border-red-500" : "border-gray-300"
                      } placeholder-gray-400 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                        setError(""); // Clear general error on input change
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="cursor-pointer" onClick={handleToggle}>
                        {showPassword ? (
                          <FaRegEye className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FaRegEyeSlash className="h-5 w-5 text-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 select-none font-serif"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 select-none font-serif"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-xs text-gray-500 font-serif select-none">
              © {new Date().getFullYear()} School Management System. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;