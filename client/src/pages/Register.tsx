import { useState } from "react";
import { register } from "../api/auth.api";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await register({ userName, fullName, password });
    alert("Registered successfully");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUserName(e.target.value)} />
      <input placeholder="Full name" onChange={e => setFullName(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Register</button>
    </div>
  );
}
