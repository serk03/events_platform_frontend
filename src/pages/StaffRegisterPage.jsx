// src/pages/StaffRegisterPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../css/UserRegisterPage.css"; // shared styles including .input-wrapper

function StaffRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("You must be logged in as staff to register other staff.");
      setCheckingAccess(false);
      return;
    }
    (async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.data()?.role === "staff") {
          setIsAuthorized(true);
        } else {
          setError("Only staff members can register new staff.");
        }
      } catch {
        setError("Error verifying access.");
      } finally {
        setCheckingAccess(false);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { firstName, lastName, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, {
        displayName: `${firstName} ${lastName}`,
      });
      await setDoc(doc(db, "users", cred.user.uid), {
        firstName,
        lastName,
        email,
        role: "staff",
        profilePicture: "",
      });
      setSuccess("Staff registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Staff registration failed");
    }
  };

  if (checkingAccess)
    return <p className="loading-message">Checking staff access...</p>;
  if (!isAuthorized) return <p className="error-message">{error}</p>;

  return (
    <div className="register-page">
      <h2>Register New Staff</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Field */}
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="input-icon"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="input-wrapper">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className="input-icon"
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" className="register-btn">
          Register Staff
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="auth-links">
        <p>
          <Link to="/">← Back to Home</Link>
        </p>
        <p>
          Want to login instead? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default StaffRegisterPage;
