import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Menu = ({ close, authorizedUser, setAuthorizedUser, credits }) => {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  const auth = getAuth();
  const navigate = useNavigate();

  function signInwithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
        // The signed-in user info.
        const user = result.user;
        if (user) {
          user.getIdToken().then((tkn) => {
            // set access token in session storage
            console.log("here");
            console.log(tkn);
            sessionStorage.setItem("accessToken", tkn);
            setAuthorizedUser(true);
          });
        }
        setAuthorizedUser(true);
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  function logoutUser() {
    signOut(auth)
      .then(() => {
        // clear session storage
        sessionStorage.clear();
        setAuthorizedUser(false);
        close();
        navigate("/");

        // window.location.replace("/");
      })
      .catch((error) => {
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
        {authorizedUser ? (
          <div>
            <li onClick={close}>
              <Link to="/buy">BUY CREDITS</Link>
            </li>
            <li>Credits: {credits}</li>
            <li className="logout" onClick={logoutUser}>
              LOGOUT
            </li>
          </div>
        ) : (
          <li onClick={close}>
            <Link to="/" onClick={signInwithGoogle}>
              LOGIN
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Menu;
