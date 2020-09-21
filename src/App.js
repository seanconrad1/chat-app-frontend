import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useCookies } from "react-cookie";

function App() {
  const [cookies] = useCookies();

  console.log(process.env.NODE_ENV);

  const getSession = () => {
    const jwt = cookies.token;

    let session;
    try {
      if (jwt) {
        const base64Url = jwt.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        // what is window.atob ?
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
        session = JSON.parse(window.atob(base64));
      }
    } catch (error) {
      console.log(error);
    }
    return session;
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          render={() => (getSession() ? <Home /> : <Login />)}
        ></Route>
      </Switch>
    </Router>
  );
}

// function PrivateRoute({ component: Component, ...rest }) {
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         fakeAuth.isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: props.location },
//             }}
//           />
//         )
//       }
//     />
//   );
// }

export default App;
