import React, { useState } from "react";
import Logo from "../img/futureblendlogo.png";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const Header = () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  const auth = getAuth();

  const [authorizedUser, setAuthorizedUser] = useState(
    false || sessionStorage.getItem("accessToken")
  );

  function signInwithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        if (user) {
          user.getIdToken().then((tkn) => {
            // set access token in session storage
            sessionStorage.setItem("accessToken", tkn);
            setAuthorizedUser(true);
          });
        }
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
        // window.location.replace("/");
        alert("Logged Out Successfully");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  }

  return (
    <div>
      {authorizedUser ? (
        <>
          <header>
            <div class="logo">
              <img src={Logo} alt="Logo" />
              <h2 className="title">FutureBlend</h2>
            </div>
            <div className="buttons">
              <button className="credits-button">Buy credits</button>
              <button className="login-button" onClick={logoutUser}>
                Log Out
              </button>
            </div>
          </header>
        </>
      ) : (
        <>
          <header>
            <div class="logo">
              <img src={Logo} alt="Logo" />
              <h2 className="title">FutureBlend</h2>
            </div>
            <div className="login-button">
              <button onClick={signInwithGoogle}>SignWithGoogle</button>
            </div>
          </header>
        </>
      )}
    </div>
  );
};

export default Header;
