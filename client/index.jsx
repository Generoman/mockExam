import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { fetchJSON } from "./fetchJSON";
import { useLoader } from "./useLoader";
import * as process from "process";

function FrontPage() {
  return (
    <>
      <h1>Mock Exam</h1>
      <ul>
        <li>
          <Link to={"/movies"}>See list of movies</Link>
        </li>
        <li>
          <Link to={"/movies/search"}>Search</Link>
        </li>
        <li>
          <Link to={"/movies/add"}>Add a movie</Link>
        </li>
        <li>
          <Link to={"/login"}>Login</Link>
        </li>
        <li>
          <Link to={"/profile"}>Profile</Link>
        </li>
      </ul>
    </>
  );
}

function AllMovies() {
  const { loading, error, data } = useLoader(async () => {
    return fetchJSON("api/movies");
  });

  if (loading) {
    return <>Please wait...</>;
  }

  if (error) {
    return (
      <>
        <h2>An error occurred</h2>
        <div>{error.toString()}</div>
      </>
    );
  }

  return (
    <>
      <h1>Movies</h1>
      <ul>
        {data.map((movie) => (
          <li key={movie.title}>{movie.title}</li>
        ))}
      </ul>
    </>
  );
}

function AddMovie() {
  return null;
}

function OneMovie() {
  return null;
}

function DeleteMovie() {
  return null;
}

function Movie() {
  return (
    <Routes>
      <Route path={"/"} element={<OneMovie />} />
      <Route path={"/update"} element={<UpdateMovie />} />
      <Route path={"/delete"} element={<DeleteMovie />} />
    </Routes>
  );
}

function UpdateMovie() {
  return null;
}

function SearchMovie() {
  return null;
}

function Movies() {
  return (
    <Routes>
      <Route path={"/"} element={<AllMovies />} />
      <Route path={"/movie/*"} element={<Movie />} />
      <Route path={"/search"} element={<SearchMovie />} />
      <Route path={"/add"} element={<AddMovie />} />
    </Routes>
  );
}

function LoginPage() {
  useEffect(async () => {
    const { authorization_endpoint } = await fetchJSON(
      "https://accounts.google.com/.well-known/openid-configuration"
    );

    const parameters = {
      response_type: "token",
      client_id: process.env.GOOGLE_CLIENT_ID, // virker ikke ennå
      scope: "email profile",
      redirect_uri: window.location.origin + "/login/callback",
    };

    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(parameters);
  }, []);

  return (
    <>
      <p>Please wait...</p>
    </>
  );
}

function LoginCallback() {
  const navigate = useNavigate();
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

  return (
    <>
      <h1>Please wait...</h1>
    </>
  );
}

function Login() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage />} />
      <Route path={"/callback"} element={<LoginCallback />} />
    </Routes>
  );
}

function Profile() {
  const { loading, data, error } = useLoader(async () => {
    return await fetchJSON("/api/login");
  });

  if (loading) {
    return <div>Please wait...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.toString()}</div>;
  }

  const { name, email, picture } = data;

  return (
    <>
      <h1>Profile</h1>
      <img src={picture} alt={"profile picture"} width={"100px"} />
      <div>Name: {name}</div>
      <div>Email: {email}</div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<FrontPage />} />
        <Route path={"/movies/*"} element={<Movies />} />
        <Route path={"/login/*"} element={<Login />} />
        <Route path={"/profile"} element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
