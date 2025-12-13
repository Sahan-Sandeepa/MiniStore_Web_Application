import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ userName, fullName, password });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" />
      <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
