import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function StaffRoute({ children }) {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) return setIsAllowed(false);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "staff") {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    };

    checkRole();
  }, []);

  if (isAllowed === null) return <p>Loading staff check...</p>;
  if (!isAllowed) return <Navigate to="/login" replace />;

  return children;
}

export default StaffRoute;
