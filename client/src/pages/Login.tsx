import { useState } from "react";
import { login as loginApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await loginApi({ userName, password });
    login(res.data.token);
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setUserName(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}
