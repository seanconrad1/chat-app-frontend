import React from "react";
import styled from "styled-components";

const OnlineUsersContainer = styled.div`
  width: 14rem;
  background: rgb(33, 37, 43);
  height: 100%;

  #title {
    padding: 2rem;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
  #users-container {
    margin-left: 1rem;
  }
  #user {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  #green-orb {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: rgb(99, 242, 130);
    margin-right: 1rem;
  }
`;

const filterUsers = (value, index, self) => {
  return self.indexOf(value) === index;
};

const OnlineUsers = ({ users }) => {
  let filteredUsers = users.filter(filterUsers);

  return (
    <OnlineUsersContainer>
      <div id="title">members - </div>

      <div id="users-container">
        {filteredUsers.map((user, key) => {
          return (
            <div key={key} id="user">
              <div id="green-orb"></div>
              <div id="username">{user}</div>
            </div>
          );
        })}
      </div>
    </OnlineUsersContainer>
  );
};

export default OnlineUsers;
