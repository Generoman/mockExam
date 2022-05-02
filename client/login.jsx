import { Link, Route, Routes, useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { fetchJSON } from "./fetchJSON";

export const LoginContext = React.createContext(undefined);

export function randomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
}

export function Login() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage />} />
      <Route
        path={"/redirect/google"}
        element={<LoginRedirect endpoint={"google"} />}
      />
      <Route
        path={"/redirect/idporten"}
        element={<LoginRedirect endpoint={"id_porten"} />}
      />
      <Route path={"/callback"} element={<LoginCallback />} />
    </Routes>
  );
}

export function LoginPage() {
  return (
    <>
      <ul>
        <li>
          <Link to={"/login/redirect/google"}>Login with Google</Link>
        </li>
        <li>
          <Link to={"/login/redirect/idporten"}>Login with ID-Porten</Link>
        </li>
      </ul>
    </>
  );
}

export function LoginRedirect(props) {
  const endpoint = props.endpoint;

  const { [endpoint]: parameters } = useContext(LoginContext);
  useEffect(async () => {
    const { authorization_endpoint } = await fetchJSON(
      parameters.discovery_endpoint
    );

    if (endpoint === "id_porten") {
      window.sessionStorage.setItem("expected_state", randomString(50));
    }

    parameters.redirect_uri = window.location.origin + "/login/callback";

    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(parameters);
  }, []);

  return (
    <>
      <p>Please wait...</p>
    </>
  );
}

export function LoginCallback(props) {
  const navigate = useNavigate();

  if (props.endpoint === "google") {
    useEffect(async () => {
      const { access_token } = Object.fromEntries(
        new URLSearchParams(window.location.hash.substring(1))
      );

      await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ access_token }),
      });
      navigate("/");
    }, []);
  } else if (props.endpoint === "id_porten") {
    useEffect(async () => {
      const expectedState = window.sessionStorage.getItem("expected_state");
      const { access_token, state } = Object.fromEntries(
        new URLSearchParams(window.location.hash.substring(1))
      );

      if (expectedState !== state) {
        return (
          <>
            <h1>Unexpected Redirect</h1>
            <div>State Mismatch</div>
          </>
        );
      }
    });
  } else {
    return (
      <>
        <h1>Error: Unexpected Endpoint</h1>
      </>
    );
  }

  return (
    <>
      <h1>Please wait...</h1>
    </>
  );
}
