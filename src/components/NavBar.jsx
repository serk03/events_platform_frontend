import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Event App</Link>
      </div>
      <div className="navbar-links">
        <link to="/" className="nav-link">
          Home
        </link>
        <link to="/favourites" className="nav-link">
          Favourites
        </link>
      </div>
    </nav>
  );
}
export default NavBar;
