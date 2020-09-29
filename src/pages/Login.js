import React, { useState } from "react";
import { useCookies } from "react-cookie";
import getURL from "../utils/config";
import styled from "styled-components";

const LoginContainer = styled.div`
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center; /*centers items on the line (the x-axis by default)*/
  align-items: center;
  flex-direction: column;
  background: rgb(40, 44, 52);
  height: 100vh;

  button {
    background: rgb(250, 113, 136);
    outline: none;
    border: none;
    border-radius: 20px;
    padding: 10px 30px;
    font-weight: 600;
    font-size: 1.5rem;
    color: #fff;
    margin-top: 1rem;
    width: 13rem;
    cursor: pointer;
    :active {
      background: rgb(250, 113, 116);
    }
  }

  input {
    border-radius: 5px;
    border: none;
    outline: none;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    font-family: "Roboto", sans-serif;
    font-size: 1.5rem;
    outline: 0;
    background: #f2f2f2;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @keyframes showup {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  #error {
    color: white;
    animation: showup 5s;
  }
`;

const Login = () => {
  const url = getURL(process.env.NODE_ENV);
  const [cookies, setCookie] = useCookies();
  const [error, setError] = useState("");
  const [username, setUsername] = useState(
    process.env.NODE_ENV === "development" ? "" : ""
  );
  const [password, setPassword] = useState(
    process.env.NODE_ENV === "development" ? "" : ""
  );

  const submit = async (e) => {
    e.preventDefault();
    let response;
    response = await fetch(`${url}validateLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ username, password }), // body data type must match "Content-Type" header
    });

    const result = await response.json();

    if (result.error) {
      setError(result.error);
    }

    if (result.token && result.username) {
      setCookie("token", result.token, { path: "/" });
      setCookie("username", result.username, { path: "/" });
      setCookie("img", result.img, { path: "/" });
    }
  };

  return (
    <LoginContainer>
      {error && <div id="error">{error}</div>}
      <form onSubmit={submit}>
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
        <button type="submit">Login</button>
      </form>
    </LoginContainer>
  );
};

export default Login;
