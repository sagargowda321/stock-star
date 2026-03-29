import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    margin: "0 20px",
    padding: "8px 15px",
    borderRadius: "8px",
    textDecoration: "none",
    color: location.pathname === path ? "#ffffff" : "#007bff",
    backgroundColor: location.pathname === path ? "#007bff" : "transparent",
    fontWeight: location.pathname === path ? "700" : "500",
    transition: "0.3s",
  });

  return (
    <nav style={{
      padding: "15px 0",
      textAlign: "center",
      backgroundColor: "#f0f2f5",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={linkStyle("/")}>Home</Link>
      <Link to="/stocks" style={linkStyle("/stocks")}>Stocks</Link>
      <Link to="/portfolio" style={linkStyle("/portfolio")}>Portfolio</Link>
    </nav>
  );
}

export default Navbar;
