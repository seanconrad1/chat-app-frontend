const getURL = (env) => {
  if (env === "development") {
    return "http://localhost:5000/";
  } else if (env === "production") {
    return "https://sean.software/";
  }
};

export default getURL;
