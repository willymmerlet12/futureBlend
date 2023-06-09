import React, { useEffect } from "react";
import { app } from "../config/firebaseauth";

const db = app.auth();
const db1 = app.firestore();
const Success = () => {
  useEffect(() => {
    const updateCredits = async (userId, credits) => {
      try {
        // Get the user document reference in Firestore
        const userRef = db1.collection("users").doc(userId);

        // Check if the document exists
        const doc = await userRef.get();

        if (doc.exists) {
          // Update the existing document
          await userRef.update({ credits: credits });
        } else {
          // Create a new document with the credits field
          await userRef.set({ credits: credits });
        }

        console.log("Credits updated successfully");
      } catch (error) {
        console.error("Error updating credits:", error);
        // Handle the error gracefully
      }
    };

    const handlePaymentSuccess = async () => {
      // Retrieve the priceId from the query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const priceId = urlParams.get("priceId");

      const unsubscribe = db.onAuthStateChanged((user) => {
        if (user) {
          console.log("User present");
          let creditsToAdd = 0;
          if (priceId === "price_1NGo10DI1bwWeEay7SgQQYAm") {
            creditsToAdd = 100;
            console.log("1");
          } else if (priceId === "price_1NGo0QDI1bwWeEayilmBZAPk") {
            creditsToAdd = 50;
            console.log("2");
          } else if (priceId === "price_1NGnznDI1bwWeEayMnKermYo") {
            creditsToAdd = 25;
            console.log("3");
          }
          updateCredits(user.uid, creditsToAdd);
        }
      });

      return () => {
        unsubscribe();
      };
    };

    handlePaymentSuccess();
  }, []);

  return (
    <div>
      <h1>Success</h1>
    </div>
  );
};

export default Success;
