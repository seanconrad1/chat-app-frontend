const getURL = (env) => {
  if (env === "development") {
    return "http://localhost:5001/";
  } else if (env === "production") {
    return "https://nodejs-chat-squad.herokuapp.com/";
  }
};

export default getURL;
