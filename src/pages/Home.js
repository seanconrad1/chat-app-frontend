import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import io from "socket.io-client";
import Message from "../components/Message";
import OnlineUsers from "../containers/OnlineUsers";

const HomeContainer = styled.div`
  font-family: 400 13.3333px Arial;
  background: rgb(40, 44, 52);
  justify-content: flex-end;
  color: rgb(218, 219, 220);
  display: flex;
  height: 100%;

  form {
    background: white;
    padding: 3px;
    position: fixed;
    bottom: 0;
    width: 100%;
    align-items: center;
    display: flex;
    background: rgb(46, 56, 64);
  }
  form input {
    padding: 1rem;
    width: 90%;
    margin-right: 0.5%;
    font-size: 2rem;
    border-radius: 50px;
    border: 1px solid transparent;
    outline: none;
    background: rgb(46, 56, 64);
    color: rgb(218, 219, 220);
  }
  form button {
    background: rgb(130, 224, 255);
    border: none;
    border-radius: 50px;
    width: 10%;
    padding: 2.1rem;
    display: flex;
    height: 0rem;
    align-items: center;
    justify-content: center;
    outline: none;
  }
  form button:active {
    background-color: #2473a1;
    box-shadow: 5px #666;
    transform: translateY(3px);
  }
  #messages {
    font-family: 400 13.3333px Arial;
    display: flex;
    flex-direction: column;
    align-self: flex-end;
    margin-bottom: 2rem;

    list-style-type: none;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    justify-content: flex-end;
    margin-bottom: 7rem;
    width: 100%;
  }
`;

const Home = () => {
  const [cookies, setCookie] = useCookies();
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);

  const inputEl = useRef(null);

  const ENDPOINT = "https://nodejs-chat-squad.herokuapp.com:5000";
  const socket = io(ENDPOINT);

  useEffect(() => {
    socket.on("connected", (data) => {
      setResponse(data);
    });

    socket.on("chat message", (data) => {
      setMessages([...messages, data]);

      window.scrollTo(0, document.body.scrollHeight);
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
    //
  }, [messages, socket]);

  const logout = () => {
    setCookie("token", "");
    setCookie("username", "");
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputEl.current.value) {
      socket.emit("chat message", {
        message: inputEl.current.value,
        user: cookies.username,
        img: cookies.img,
        time: new Date().toLocaleString(),
      });
      inputEl.current.value = "";
    }
  };

  const handlePaste = (e) => {
    console.log(e.clipboardData.getData("text").split(" ").join());
  };

  return (
    <HomeContainer>
      <ul id="messages">
        {messages.map((message, key) => {
          return <Message key={key} message={message} />;
        })}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          name="message"
          maxLength={1000}
          id="m"
          placeholder="Message..."
          autoComplete="off"
          ref={inputEl}
          onPaste={(e) => handlePaste(e)}
        />
      </form>

      <OnlineUsers />

      {/* <button onClick={logout}>Logout</button> */}
    </HomeContainer>
  );
};

export default Home;
