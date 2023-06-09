import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./config/firebase-config";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

function Menu({ close }) {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  const auth = getAuth();

  const [authorizedUser, setAuthorizedUser] = useState(
    false || sessionStorage.getItem("accessToken")
  );

  function logoutUser() {
    signOut(auth)
      .then(() => {
        // clear session storage
        sessionStorage.clear();
        setAuthorizedUser(false);
        // window.location.replace("/");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  }

  useEffect(() => {
    // Listen for changes in the authorizedUser state
    if (authorizedUser) {
      console.log("User is signed in");
    } else {
      console.log("User is signed out");
    }
  }, [authorizedUser]);

  return (
    <div className="menu">
      <ul>
        <li onClick={close}>
          <Link to="/"> HOME </Link>
        </li>
        <li onClick={close}>
          <Link to="/generate"> GENERATE </Link>
        </li>
        <li onClick={close}>
          <Link to="/buy">BUY CREDITS</Link>
        </li>
        <li
          onClick={() => {
            logoutUser();
            close();
          }}
        >
          <Link to="/">LOGOUT</Link>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
