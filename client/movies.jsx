import { Route, Routes } from "react-router-dom";
import React from "react";
import { useLoader } from "./useLoader";
import { fetchJSON } from "./fetchJSON";

export function AllMovies() {
  const { loading, error, data } = useLoader(async () => {
    return await fetchJSON("api/movies");
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

export function AddMovie() {
  return (
    <>
      <h1>Under construction</h1>
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
  return (
    <Routes>
      <Route path={"/"} element={<AllMovies />} />
      <Route path={"/movie/*"} element={<Movie />} />
      <Route path={"/search"} element={<SearchMovie />} />
      <Route path={"/add"} element={<AddMovie />} />
    </Routes>
  );
}
