// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/NavBar.css";

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isStaff = user && user.role === "staff";
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Event App</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/favourites" className="nav-link">
          Favourites
        </Link>

        {isStaff && (
          <>
            <Link to="/manage-events" className="nav-link">
              Manage Events
            </Link>
            <Link to="/register-staff" className="nav-link">
              Register Staff
            </Link>
          </>
        )}

        {/* 🔥 Profile Avatar + Dropdown */}
        {user && (
          <div className="profile-dropdown">
            <img
              src="https://via.placeholder.com/40" // Placeholder image
              alt="Profile"
              className="profile-avatar"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-btn"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
