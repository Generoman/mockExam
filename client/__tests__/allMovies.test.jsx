import { AllMovies } from "../allMovies";
import ReactDOM from "react-dom";
import React from "react";
import { act } from "react-dom/test-utils";

describe("AllMovies component", () => {
  it("shows loading screen", () => {
    const domElement = document.createElement("div");
    ReactDOM.render(<AllMovies />, domElement);
    expect(domElement.innerHTML).toMatchSnapshot();
  });

  it("shows people", async () => {
    const people = [
      {
        first_name: "Testie",
        last_name: "Testerson",
        email: "testie@test.test",
      },
      {
        first_name: "Testosterone",
        last_name: "Testerson",
        email: "testosterone@test.test",
      },
    ];

    const domElement = document.createElement("div");
    await act(async () => {
      ReactDOM.render(<AllMovies listMovies={() => people} />, domElement);
    });

    expect(domElement.innerHTML).toMatchSnapshot();
  });

  it("shows error", async () => {
    const domElement = document.createElement("div");
    await act(async () => {
      ReactDOM.render(
        <AllMovies
          listMovies={() => {
            throw new Error("Something went wrong");
          }}
        />,
        domElement
      );
    });

    expect(domElement.innerHTML).toMatchSnapshot();
  });
});
