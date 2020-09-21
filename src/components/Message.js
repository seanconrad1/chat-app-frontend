import React, { useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { useCookies } from "react-cookie";

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2.5rem;
  max-width: 55%;
  #avatar {
  }
  #user-and-time {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    margin-bottom: 0.5rem;
    /* margin-left: 2rem; */
  }
  #username {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  #time {
  }
  #message {
    font-size: 1.2rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    /* margin-left: 4rem; */
  }
  #message-code {
    font-size: 1.3rem;
    background: rgb(33, 37, 43);
    border: 1px solid black;
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    font-family: Arial, Helvetica, sans-serif;
    /* margin-left: 4rem; */
  }
  #user-and-time-and-message {
    margin-left: 2rem;
  }
  a {
    color: white;
  }
  img {
    max-width: 4.5rem;
    max-height: 4.5rem;

    border-radius: 50px;
  }
  #avatar-and-username {
    display: flex;
    flex-direction: row;
  }
`;
const Message = ({ message }) => {
  const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const URLregex = new RegExp(expression);
  const backTicks = new RegExp(/```/);
  const [cookies] = useCookies();

  console.log(message);

  if (message.message.match(backTicks)) {
    let code = message.message.split("```")[1];
    return (
      <MessagesContainer id="message-container">
        <div id="avatar-and-username">
          <img id="avatar" alt="avatar" src={message.img}></img>
          <div id="user-and-time-and-message">
            <div id="user-and-time">
              <div id="username">{message.user}</div>
              <div id="time">{message.time}</div>
            </div>
            <div id="message-code">{code}</div>
          </div>
        </div>
      </MessagesContainer>
    );
  } else if (message.message.match(URLregex)) {
    let url = message.message.match(URLregex);
    let part1 = message.message
      .split(message.message.match(URLregex))[0]
      .replace("https://", "");
    let part2 = message.message.split(message.message.match(URLregex))[1];
    return (
      <MessagesContainer id="message-container">
        <div id="avatar-and-username">
          <img id="avatar" alt="avatar" src={message.img}></img>
          <div id="user-and-time-and-message">
            <div id="user-and-time">
              <div id="username">{message.user}</div>
              <div id="time">{message.time}</div>
            </div>
            <div id="message">
              <div>{part1}</div>
              <a
                href={`https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {url}
              </a>
              <div>{part2}</div>
            </div>
          </div>
        </div>
      </MessagesContainer>
    );
  } else {
    return (
      <MessagesContainer id="message-container">
        <div id="avatar-and-username">
          <img id="avatar" alt="avatar" src={message.img}></img>
          <div id="user-and-time-and-message">
            <div id="user-and-time">
              <div id="username">{message.user}</div>
              <div id="time">{message.time}</div>
            </div>
            <div id="message">{message.message}</div>
          </div>
        </div>
      </MessagesContainer>
    );
  }
};

export default Message;
