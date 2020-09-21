import React, { useState } from "react";
import { useCookies } from "react-cookie";

const Login = () => {
  const [cookies, setCookie] = useCookies();
  const [username, setUsername] = useState("sean");
  const [password, setPassword] = useState("%LGF&JdWN7Apf01");

  const submit = async () => {
    let response = await fetch(
      "https://nodejs-chat-squad.herokuapp.com/validateLogin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ username, password }), // body data type must match "Content-Type" header
      }
    );

    const result = await response.json();
    if (result.token && result.username) {
      setCookie("token", result.token, { path: "/" });
      setCookie("username", result.username, { path: "/" });
      setCookie("img", result.img, { path: "/" });
    }
  };

  return (
    <div>
      Login
      <input
        name="username"
        value={username}
        maxLength={10}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        type="password"
        name="password"
        value={password}
        maxLength={20}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={submit}>Login</button>
    </div>
  );
};

export default Login;
