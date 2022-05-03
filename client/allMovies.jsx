import { useLoading } from "./useLoading";
import React from "react";

export function AllMovies({ listMovies }) {
  const { loading, error, data } = useLoading(listMovies);

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

  // For "movie" collection
  // return (
  //   <>
  //     <h1>Movies</h1>
  //     <ul>
  //       {data.map((movie) => (
  //         <li key={movie.title}>{movie.title}</li>
  //       ))}
  //     </ul>
  //   </>
  // );

  // For "test" collection
  return (
    <>
      <h1>People</h1>
      {data.map((person) => (
        <ul key={person._id}>
          <li key={person.first_name + " " + person.last_name}>
            {"Full Name: " + person.first_name + " " + person.last_name}
          </li>
          <li key={person.email}>{"Email: " + person.email}</li>
        </ul>
      ))}
    </>
  );
}
