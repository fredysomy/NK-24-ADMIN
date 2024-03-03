import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const credentials = [
      { username: "counter1@regcom", password: "reg.com1@sgits" },
      { username: "counter2@regcom", password: "reg.com2@sgits" },
      { username: "counter3@regcom", password: "reg.com3@sgits" },
      { username: "counter4@regcom", password: "reg.com4@sgits" },
      { username: "counter5@regcom", password: "reg.com5@sgits" },
      { username: "counter6@regcom", password: "reg.com6@sgits" },
      { username: "counter7@regcom", password: "reg.com7@sgits" },
      { username: "counter8@regcom", password: "reg.com8@sgits" },
      { username: "counter9@regcom", password: "reg.com9@sgits" },
      { username: "counter10@regcom", password: "reg.com10@sgits" },
      { username: "counter11@regcom", password: "reg.com11@sgits" },
      { username: "counter12@regcom", password: "reg.com12@sgits" },
      { username: "counter13@regcom", password: "reg.com13@sgits" },
      { username: "counter14@regcom", password: "reg.com14@sgits" },
      { username: "counter15@regcom", password: "reg.com15@sgits" },
      { username: "subhead1@regcom", password: "super" },
      { username: "head@regcom", password: "super" },
      { username: "subhead2@regcom", password: "super" },
    ];

    const isValidCredentials = credentials.some(
      (cred) => cred.username === username && cred.password === password
    );

    if (isValidCredentials) {
      const isAdmin =
        username === "head@regcom" ||
        username === "subhead1@regcom" ||
        username === "subhead2@regcom";

      const auth = true; // Assuming authentication is successful

      navigate("/selection", { state: { isAdmin, auth } });
    } else {
      alert("Please enter the correct username and password.");
    }
  };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="wrapper bg-transparent text-whitesmoke p-8 border-2 border-white border-opacity-20 backdrop-blur-lg shadow-lg md:w-1/2 lg:w-1/3">
        <form onSubmit={handleLogin}>
          <h1 className="text-white text-center text-3xl">Login</h1>
          <div className="input-box relative w-full h-12 my-8">
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full h-full bg-transparent border-none outline-none border-white border-opacity-20 rounded-full text-xl text-white px-8"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="input-box relative w-full h-12 my-8">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full h-full bg-transparent border-none outline-none border-white border-opacity-20 rounded-full text-xl text-white px-8"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none text-white"
              onClick={handleTogglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-white border-none outline-none rounded-full shadow-md cursor-pointer text-xl font-bold text-gray-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
