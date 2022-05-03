import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { fetchJSON } from "./fetchJSON";
import { AllMovies } from "./allMovies";

export function AddMovie() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function submitMovie(event) {
    event.preventDefault();

    const reqBody = {
      first_name: firstName,
      last_name: lastName,
      email,
    };

    const response = await fetch("/api/movies", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (response.ok) {
      navigate("/movies");
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <form onSubmit={submitMovie}>
        <h1>Add New Movie</h1>
        <p>
          <label>
            First Name:{" "}
            <input
              type={"text"}
              name={"first_name"}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Last Name:{" "}
            <input
              type={"text"}
              name={"last_name"}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Email:{" "}
            <input
              type={"text"}
              name={"email"}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
        </p>
        <button>Submit</button>
      </form>
    </>
  );
}

export function OneMovie() {
  return (
    <>
      <h1>Under construction</h1>
    </>
  );
}

export function DeleteMovie() {
  return (
    <>
      <h1>Under construction</h1>
    </>
  );
}

export function Movie() {
  return (
    <Routes>
      <Route path={"/"} element={<OneMovie />} />
      <Route path={"/update"} element={<UpdateMovie />} />
      <Route path={"/delete"} element={<DeleteMovie />} />
    </Routes>
  );
}

export function UpdateMovie() {
  return (
    <>
      <h1>Under construction</h1>
    </>
  );
}

export function SearchMovie() {
  return (
    <>
      <h1>Under construction</h1>
    </>
  );
}

export function Movies() {
  async function listMovies() {
    return await fetchJSON("/api/movies");
  }

  return (
    <Routes>
      <Route path={"/"} element={<AllMovies listMovies={listMovies()} />} />
      <Route path={"/movie/*"} element={<Movie />} />
      <Route path={"/search"} element={<SearchMovie />} />
      <Route path={"/add"} element={<AddMovie />} />
    </Routes>
  );
}
