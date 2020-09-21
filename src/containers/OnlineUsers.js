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
`;

const OnlineUsers = () => {
  return (
    <OnlineUsersContainer>
      <div id="title">members - </div>
    </OnlineUsersContainer>
  );
};

export default OnlineUsers;
