import React, { useState } from "react";
import "../Style/Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";

const Header = () => {
  // // const user = JSON.parse(localStorage.getItem('users'));
  // const navigate = useNavigate();

  // const logout = () => {
  //   localStorage.clear('users');
  //   navigate("/sign-in");
  // };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart);

  return (
    <header>
      <div id="header">
        <NavLink to="/">
          <img id="logo" src="/logo.png" alt="logo" />
        </NavLink>

        <nav className={isMobileMenuOpen ? "mobile-menu-open" : ""}>
          <menu className={isMobileMenuOpen ? "mobile-menu-open" : ""}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>

          </menu>
        </nav>

        <div id="icons">
          <div className="search-container">
            {isSearchOpen ? <SearchBar /> : null}
            <i
              className="icons fa-xl fa-solid fa-magnifying-glass search-icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            ></i>
          </div>
          <div className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i className={`icons fa-xl fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
