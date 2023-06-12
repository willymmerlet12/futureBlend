import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebaseauth";
import Task from "../task";

const db = app.firestore();

const Results = (credits, setCredits) => {
  const location = useLocation();
  const results = location.state.result;
  const auth = getAuth();

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = results[results.length - 1].uri;
    link.download = "generated_image.png";
    link.target = "_blank";

    // Simulate a click event to trigger the download
    link.dispatchEvent(new MouseEvent("click"));
  };

  useEffect(() => {
    // Fetch the user's credits from Firestore
    const fetchCredits = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userSnapshot = await db.collection("users").doc(user.uid).get();
          console.log(userSnapshot);
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            let userCredits = userData.credits || 0;
            userCredits -= 1;
            console.log(userCredits);
            console.log("credits", credits);

            // Update Firestore document
            await db.collection("users").doc(user.uid).update({
              credits: userCredits,
            });
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
    <div className="results-container">
      <div className="form-container">
        <Task token={sessionStorage.getItem("accessToken")} />
      </div>
      <div className="image-container">
        {/* Display the URI as an image */}

        <img
          className="generated-image"
          src={results[results.length - 1].uri}
          alt="Generated"
        />

        <div className="download-a">
          {/* Download button */}
          <button onClick={handleDownload} className="downladed-img">
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
