import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { fetchJSON } from "./fetchJSON";
import { useLoader } from "./useLoader";
import { Login, LoginContext } from "./login";
import { Movies } from "./movies";

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

  if (!data) {
    return (
      <>
        <h1>Please log in first</h1>
      </>
    );
  }

  const { name, email, picture } = data;

  return (
    <>
      <h1>Profile</h1>
      {picture && <img src={picture} alt={"profile picture"} width={"100px"} />}
      <div>Name: {name}</div>
      <div>Email: {email}</div>
    </>
  );
}

function App() {
  const { loading, error, data } = useLoader(
    async () => await fetchJSON("/api/config")
  );

  if (loading) {
    return (
      <>
        <h3>Loading...</h3>
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1>An Error Occurred</h1>
        <div>{error.toString()}</div>
      </>
    );
  }
  return (
    <LoginContext.Provider value={data}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<FrontPage />} />
          <Route path={"/movies/*"} element={<Movies />} />
          <Route path={"/login/*"} element={<Login />} />
          <Route path={"/profile"} element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </LoginContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
