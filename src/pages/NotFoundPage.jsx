import { Link } from "react-router-dom";
import "../css/NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="home-link">
        ← Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
