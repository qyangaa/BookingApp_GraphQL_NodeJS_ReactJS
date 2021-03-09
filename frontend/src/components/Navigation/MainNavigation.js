import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
// NavLink prevents default in <a>  (which reloads page when clicked)
import AuthContext from "../../context/auth-context";
import "./MainNavigation.css";

export default function MainNavigation() {
  const authContext = useContext(AuthContext);
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!authContext.token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>

          {authContext.token && (
            <React.Fragment>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={authContext.logout}>Logout</button>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
}
