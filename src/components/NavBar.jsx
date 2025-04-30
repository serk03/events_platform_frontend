// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../css/NavBar.css";

const DEFAULT_AVATAR = "https://placehold.co/40x40";

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isStaff = user && user.role === "staff";
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("staffToken");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [dropdownOpen]);

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

        {user && (
          <div className="profile-dropdown">
            <img
              ref={avatarRef}
              src={user.profilePicture || DEFAULT_AVATAR}
              alt="Profile"
              className="profile-avatar"
              onClick={() => setDropdownOpen((open) => !open)}
            />

            {dropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
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
