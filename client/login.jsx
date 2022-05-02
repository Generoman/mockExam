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

export async function sha256(string) {
  const binaryHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(string)
  );

  return btoa(String.fromCharCode.apply(null, new Uint8Array(binaryHash)))
    .split("=")[0]
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
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
        element={<LoginRedirect endpoint={"idporten"} />}
      />
      <Route
        path={"/callback/google"}
        element={<LoginCallback endpoint={"google"} />}
      />
      <Route
        path={"/callback/idporten"}
        element={<LoginCallback endpoint={"idporten"} />}
      />
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

    if (endpoint === "idporten") {
      const code_verifier = randomString(50);
      window.sessionStorage.setItem("expected_state", randomString(50));
      window.sessionStorage.setItem("code_verifier", code_verifier);
      parameters.code_challenge = await sha256(code_verifier);
      parameters.code_challenge_method = "S256";
    }

    parameters.redirect_uri =
      window.location.origin + "/login/callback/" + endpoint;

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

  // const endpoint = props.endpoint;
  // const { [endpoint]: parameters } = useContext(LoginContext);
  // const { discovery_endpoint, client_id } = parameters;
  //
  // if (props.endpoint === "google") {
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
  // } else if (props.endpoint === "idporten") {
  //   useEffect(async () => {
  //     const code_verifier = window.sessionStorage.getItem("expected_state");
  //     const { access_token, state, code } = Object.fromEntries(
  //       new URLSearchParams(window.location.hash.substring(1))
  //     );
  //
  //     if (code_verifier !== state) {
  //       return (
  //         <>
  //           <h1>Unexpected Redirect</h1>
  //           <div>State Mismatch</div>
  //         </>
  //       );
  //     }
  //
  //     if (code) {
  //       const { token_endpoint } = await fetchJSON(discovery_endpoint);
  //       const tokenResponse = await fetch(token_endpoint, {
  //         method: "POST",
  //         body: new URLSearchParams({
  //           code,
  //           grant_type: "authorization_code",
  //           client_id,
  //           code_verifier,
  //         }),
  //       });
  //     }
  //
  //     await fetch("/api/login", {
  //       method: "POST",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify({ access_token }),
  //     });
  //   }, []);
  // } else {
  //   return (
  //     <>
  //       <h1>Error: Unexpected Endpoint</h1>
  //     </>
  //   );
  // }

  return (
    <>
      <h1>Please wait...</h1>
    </>
  );
}
