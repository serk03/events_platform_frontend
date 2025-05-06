import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateProfile,
  updatePassword,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../css/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const [firstName = "", lastName = ""] =
          user.displayName?.split(" ") || [];
        setFormData({
          firstName,
          lastName,
          email: user.email,
          profilePicture: user.photoURL || "",
          password: "",
          confirmPassword: "",
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const { firstName, lastName, profilePicture, password, confirmPassword } =
      formData;

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: `${firstName} ${lastName}`,
          photoURL: profilePicture || null,
        });

        if (password) {
          await updatePassword(auth.currentUser, password);
        }

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          firstName,
          lastName,
          profilePicture: profilePicture || "",
        });

        const updatedUser = {
          email: auth.currentUser.email,
          profilePicture: auth.currentUser.photoURL,
          fullName: auth.currentUser.displayName,
          role: JSON.parse(localStorage.getItem("user"))?.role || "user",
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage"));

        setSuccess("Profile updated successfully");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        localStorage.removeItem("user");
        localStorage.removeItem("favourites");
        navigate("/login");
      }
    } catch (err) {
      setError("Error deleting account");
      console.error(err);
    }
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-picture-preview">
          <img
            src={formData.profilePicture || "https://placehold.co/100x100"}
            alt="Current Profile"
            className="profile-picture"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/100x100";
            }}
          />
        </div>

        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input type="email" name="email" value={formData.email} disabled />

        <input
          type="text"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
          placeholder="Profile Picture URL"
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit">Save Changes</button>
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="delete-btn"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </form>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ProfilePage;
