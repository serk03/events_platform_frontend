import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../css/NavBar.css";

const DEFAULT_AVATAR = "https://placehold.co/40x40";

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setDropdownOpen(false); // 🔒 Ensure dropdown starts closed

      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();
        const fullName =
          firebaseUser.displayName ||
          `${userData?.firstName || ""} ${userData?.lastName || ""}`;
        const profilePicture =
          firebaseUser.photoURL || userData?.profilePicture || "";
        const role = userData?.role || "user";

        const newUser = {
          email: firebaseUser.email,
          fullName,
          profilePicture,
          role,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    localStorage.removeItem("staffToken");
    setUser(null);
    setDropdownOpen(false); // 🔒 Close dropdown on logout
    navigate("/login");
  };

  const isStaff = user?.role === "staff";

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
        <Link to="/">Event-US</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {user && (
          <>
            <Link to="/favourites" className="nav-link">
              Favourites
            </Link>
            <Link to="/booked" className="nav-link">
              Booked Events
            </Link>
          </>
        )}

        {isStaff && (
          <>
            <Link to="/create-event" className="nav-link">
              Create Event
            </Link>
            <Link to="/register-staff" className="nav-link">
              Register Staff
            </Link>
          </>
        )}

        {!user ? (
          <div className="auth-buttons">
            <Link to="/login" className="auth-link login">
              Login
            </Link>
            <Link to="/register" className="auth-link signup">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="profile-dropdown">
            <div
              className="profile-info"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <img
                ref={avatarRef}
                src={user.profilePicture?.trim() || DEFAULT_AVATAR}
                alt="Profile"
                className="profile-avatar"
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              />
              <span className="user-role-label">{user.role}</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <div className="dropdown-header">
                  <strong>{user.fullName}</strong>
                </div>
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
