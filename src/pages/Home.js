import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import Message from "../components/Message";
import OnlineUsers from "../containers/OnlineUsers";
import { useImmer } from "use-immer";
import { socket } from "../service/socket";

const HomeContainer = styled.div`
  font-family: 400 13.3333px Arial;
  background: rgb(40, 44, 52);
  justify-content: flex-end;
  color: rgb(218, 219, 220);
  display: flex;

  form {
    background: white;
    padding: 0.2em;
    position: fixed;
    bottom: 0;
    width: 100%;
    align-items: center;
    display: flex;
    background: rgb(46, 56, 64);
    z-index: 2;
  }
  form input {
    padding: 1em;
    width: 90%;
    margin-right: 0.5%;
    font-size: 2em;
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
    padding: 2.1em;
    display: flex;
    height: 0em;
    align-items: center;
    justify-content: center;
    outline: none;
  }
  form button:active {
    background-color: #2473a1;
    box-shadow: 5px #666;
    transform: translateY(3px);
  }
  #messages-and-typing {
    font-family: 400 13.3333px Arial;
    display: flex;
    flex-direction: column;
    align-self: flex-end;
    margin-bottom: 2em;

    list-style-type: none;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    justify-content: flex-end;
    margin-bottom: 7em;
    width: 100%;
  }

  #typing {
    margin-left: 2rem;
    padding: 1rem;
    color: grey;
  }
`;

const Home = () => {
  const [cookies, setCookie] = useCookies();
  const inputEl = useRef(null);
  const messagesEl = useRef(null);
  const [messages, setMessages] = useImmer([]);
  const [onlineUsers, setOnline] = useImmer([]);
  const [userTyping, setUserTyping] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }

    socket.emit("join");

    const eventHandler = () => setConnected(true);

    socket.on("WELCOME_FROM_SERVER", eventHandler);

    socket.once("connect", (socketConn) => {
      socket.on("chat message", (msg) => {
        setMessages((draft) => {
          draft.push(msg);
        });
        var options = {
          body: msg.message,
          icon: `${msg.img}   auto=compress&cs=tinysrgb&dpr=1&w=500`,
          dir: "ltr",
        };
        var notification = new Notification("Chat Squad", options);
        scrollToBottom();
      });

      socket.on("online-users", (people) => {
        setOnline((draft) => {
          draft.push(...people);
        });
      });

      socket.on("user-typing", (user) => {
        console.log(user);
        setUserTyping(user);
      });

      socket.on("user-stopped-typing", (user) => {
        setUserTyping("");
      });

      socket.on("user-disconnected", (people) => {
        setOnline((draft) => {
          draft.pop(people);
        });
      });
    });

    return () => {
      socket.off("disconnected", eventHandler);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, 0);

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

  var typing = false;
  var timeout = undefined;

  const timeoutFunction = () => {
    typing = false;
    socket.emit("stopped-typing");
  };

  const onKeyDownNotEnter = (e) => {
    if (e.key !== "Enter") {
      if (typing == false) {
        typing = true;
        socket.emit("typing");
        timeout = setTimeout(timeoutFunction, 5000);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 5000);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEl.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <HomeContainer>
      <div id="messages-and-typing">
        <ul id="messages">
          {messages.map((message, key) => {
            return <Message key={key} message={message} />;
          })}
        </ul>
        {userTyping && userTyping !== cookies.username && (
          <div id="typing">{userTyping} is typing...</div>
        )}
        <div style={{ float: "left", clear: "both" }} ref={messagesEl}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input
          name="message"
          maxLength={1000}
          id="m"
          placeholder="Message..."
          autoComplete="off"
          ref={inputEl}
          onKeyDown={onKeyDownNotEnter}
        />
      </form>

      <OnlineUsers users={onlineUsers} />
    </HomeContainer>
  );
};

export default Home;
