import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../img/futureblendlogo.png";
import Popup from "reactjs-popup";
import Menu from "../Menu";
import Menuu from "../Menuu";
import BurgerIcon from "../BurgerIcon";
import "../config/firebase-config";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  signInWithRedirect,
} from "firebase/auth";
import { app } from "../config/firebaseauth";
import { useNavigate } from "react-router-dom";

const db = app.firestore();

const Header = ({ credits, setCredits }) => {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  const auth = getAuth();
  const navigate = useNavigate();

  const [authorizedUser, setAuthorizedUser] = useState(
    false || sessionStorage.getItem("accessToken")
  );

  const contentStyle = {
    background: "rgba(255,255,255,0",
    width: "80%",
    border: "none",
  };

  function signInwithGoogle() {
    const isDesktop = /Mac|Windows|(Linux)|(X11)/.test(navigator.userAgent);
    if (isDesktop) {
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
    } else {
      signInWithRedirect(auth, provider)
        .then(() => {
          const result = auth.getRedirectResult();
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          console.log(token);
          const user = result.user;
          if (user) {
            user.getIdToken().then((tkn) => {
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
  }

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
    // Fetch the user's credits from Firestore
    const fetchCredits = async () => {
      try {
        const user = auth.currentUser;
        console.log("user", user);
        if (user) {
          console.log("aki");
          const userSnapshot = await db.collection("users").doc(user.uid).get();
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            const userCredits = userData.credits || 0;
            setCredits(userCredits);
            console.log(userCredits);
          }
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
        // Handle the error gracefully
      }
    };

    // Listen for changes in the authorizedUser state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in");
        fetchCredits();
      } else {
        console.log("User is signed out");
        setCredits(0);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {authorizedUser ? (
        <>
          <header>
            <Link to="/">
              <div className="logo">
                <img src={Logo} alt="Logo" />
                <h2 className="title">FutureBlend</h2>
              </div>
            </Link>
            <div className="buttons">
              <p>Credits: {credits}</p>
              <Link to="/buy">
                <button className="credits-button">Buy credits</button>
              </Link>
              <button className="login-button" onClick={logoutUser}>
                Log Out
              </button>
            </div>
          </header>
          <Popup
            modal
            overlayStyle={{ background: "rgba(255,255,255,0.98" }}
            contentStyle={contentStyle}
            closeOnDocumentClick={false}
            trigger={(open) => <BurgerIcon open={open} />}
          >
            {(close) => (
              <Menuu
                close={close}
                authorizedUser={authorizedUser}
                setAuthorizedUser={setAuthorizedUser}
                credits={credits}
              />
            )}
          </Popup>
        </>
      ) : (
        <>
          <header>
            <Link to="/">
              <div className="logo">
                <img src={Logo} alt="Logo" />
                <h2 className="title">FutureBlend</h2>
              </div>
            </Link>
            <div>
              <button className="login" onClick={signInwithGoogle}>
                Sign In
              </button>
            </div>
          </header>
          <Popup
            modal
            overlayStyle={{ background: "rgba(255,255,255,0.98" }}
            contentStyle={contentStyle}
            closeOnDocumentClick={false}
            trigger={(open) => <BurgerIcon open={open} />}
          >
            {(close) => (
              <Menuu
                close={close}
                authorizedUser={authorizedUser}
                setAuthorizedUser={setAuthorizedUser}
              />
            )}
          </Popup>
        </>
      )}
    </div>
  );
};

export default Header;
