import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { app } from "../config/firebaseauth";
import token from "../img/token.png";
import token1 from "../img/token2.png";
import token2 from "../img/token3.png";

const stripePromise = loadStripe(
  "pk_test_51NGmWwDI1bwWeEay9Md5LmaSVNS6RugBqKcxK8WxKvlar77yXUAJmTMFzP7aB6VOvfad3qJoDdB0X0Z6Lwl2MWvF00vUFR4WAh"
);
const db = app.auth();
const db1 = app.firestore();
const Buy = () => {
  const user = db.currentUser;

  const handleCheckout = async (priceId) => {
    try {
      const stripe = await stripePromise;

      const response = await fetch(
        "http://localhost:3001/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priceId }),
        }
      );

      const session = await response.json();

      // Redirect the customer to the Stripe Checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `http://localhost:3000/`,
        cancelUrl: "http://localhost:3000/cancel",
        mode: "payment",
      });

      // Handle any errors during redirection
      if (result.error) {
        console.log(result.error.message);
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        console.log("Payment succeeded:", result.paymentIntent);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      // Handle the error gracefully
    }
  };

  return (
    <div className="credits-section">
      <h1>Buy Credits</h1>
      <h2>
        Each generated image costs one credit. <br /> You can also create
        variants from existing images using one credit.
      </h2>
      <section className="creds">
        <div className="creds-div">
          <img className="creds-image" src={token} alt="FutureBlend credit" />
          <p className="creds-content">$0.20 per image</p>
          <button
            onClick={() => handleCheckout("price_1NGnznDI1bwWeEayMnKermYo")}
          >
            BUY FOR $5
          </button>
        </div>
        <div className="creds-div">
          <img
            className="creds-image"
            src={token2}
            alt="FutureBlend credit image2"
          />
          <p className="creds-content">$0.18 per image</p>
          <button
            onClick={() => handleCheckout("price_1NGo0QDI1bwWeEayilmBZAPk")}
          >
            BUY FOR $9
          </button>
        </div>
        <div className="creds-div">
          <img
            className="creds-image"
            src={token1}
            alt="FutureBlend credit image3"
          />
          <p className="creds-content">$0.17 per image</p>
          <button
            onClick={() => handleCheckout("price_1NGo10DI1bwWeEay7SgQQYAm")}
          >
            BUY FOR $17
          </button>
        </div>
      </section>
    </div>
  );
};

export default Buy;
