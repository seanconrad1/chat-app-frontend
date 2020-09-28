const getURL = (env) => {
  if (env === "development") {
    return "http://localhost:3000/";
  } else if (env === "production") {
    return "http://167.172.244.231:5000/";
  }
};

export default getURL;
