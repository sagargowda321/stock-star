import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Portfolio from "./pages/Portfolio";
import { PortfolioProvider } from "./context/PortfolioContext";
import "./App.css";

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <nav className="navbar">
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/stocks" className={({ isActive }) => (isActive ? "active" : "")}>
                Stocks
              </NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" className={({ isActive }) => (isActive ? "active" : "")}>
                Portfolio
              </NavLink>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
