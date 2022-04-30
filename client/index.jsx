import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { fetchJSON } from "./fetchJSON";
import { useLoader } from "./useLoader";

function FrontPage() {
  return (
    <>
      <h1>Movie Database</h1>
      <ul>
        <li>
          <Link to={"/movies"}>See all movies</Link>
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
    return <>Loading...</>;
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
      client_id:
        "634400868877-incko50mf4i2f97adsatsdaiam149s1t.apps.googleusercontent.com",
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
  return (
    <>
      <h1>Login Callback</h1>
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
  return (
    <>
      <h1>Profile Page</h1>
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
