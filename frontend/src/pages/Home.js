import React from "react";
import "../App.css";
import logo from "../assets/logo.png"; // logo inside src/assets

function Home() {
  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1 className="home-text">
        Welcome to <span className="highlight-text">Stock Star</span>
      </h1>
    </div>
  );
}

export default Home;
