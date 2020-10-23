import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import LoginToken from "./loginToken";
import "./Navigation.css";

// Renders a navigation bar which is dependent on whether a user is logged in.
function Navigation({ logOut }) {
  const { token } = useContext(LoginToken);

  // If user logged in show logged in specific navbar elements, else fewer links.
  return (
    <nav>
      {token ? (
        <ul>
          <li>
            <NavLink to="/">Jobly</NavLink>
          </li>
          <li>
            <NavLink to="/companies">Companies</NavLink>
          </li>
          <li>
            <NavLink to="/jobs">Jobs</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink onClick={logOut} to="/">
              Logout
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <NavLink to="/">Jobly</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navigation;
