import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import io from "socket.io-client";
import Message from "../components/Message";
import OnlineUsers from "../containers/OnlineUsers";
import getURL from "../utils/config";
import useSocket from "use-socket.io-client";
import { useImmer } from "use-immer";

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
  const inputEl = useRef(null);
  const url = getURL(process.env.NODE_ENV);
  const [socket] = useSocket(url);
  const [messages, setMessages] = useImmer([]);
  const [onlineUsers, setOnline] = useImmer([]);

  socket.connect();

  useEffect(() => {
    socket.emit("join");

    socket.on("chat message", (msg) => {
      setMessages((draft) => {
        draft.push(msg);
      });
    });

    socket.on("online-users", (people) => {
      setOnline((draft) => {
        draft.push(...people);
      });
    });

    socket.on("user-disconnected", (people) => {
      console.log(people);
      setOnline((draft) => {
        draft.pop(people);
      });
    });

    return () => {};
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, 0);

  console.log("WHAT", onlineUsers);

  const logout = () => {
    socket.disconnect();
    setCookie("token", "");
    setCookie("username", "");
    setCookie("img", "");
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputEl.current.value) {
      socket.emit("message", {
        message: inputEl.current.value,
        user: cookies.username,
        img: cookies.img,
        time: new Date().toLocaleString(),
      });
      inputEl.current.value = "";
    }
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
        />
      </form>

      <OnlineUsers users={onlineUsers} />
    </HomeContainer>
  );
};

export default Home;
