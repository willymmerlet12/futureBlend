import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import token from "../img/token.png";
import token1 from "../img/token2.png";
import token2 from "../img/token3.png";

const stripePromise = loadStripe(
  "pk_live_51NGmWwDI1bwWeEay08ePMQavGqJMbMbJYFeWMxreO32aJ1HRK62muH2FhIXnMzVYSYPiTRCAxWWtO9lzbuic3j8F00lKIzpFur"
);

const Buy = () => {
  const handleCheckout = async (priceId) => {
    try {
      const stripe = await stripePromise;

      const response = await fetch(
        "https://futureblend.herokuapp.com/create-checkout-session",
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
        successUrl: `https://futureblend.herokuapp.com/generate`,
        cancelUrl: "https://futureblend.herokuapp.com/",
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
          <p className="creds-content">$0.60 per imag (4 images total)</p>
          <button
            onClick={() => handleCheckout("price_1NHCeaDI1bwWeEays9buan4Q")}
          >
            BUY FOR $3
          </button>
        </div>
        <div className="creds-div">
          <img
            className="creds-image"
            src={token2}
            alt="FutureBlend credit image2"
          />
          <p className="creds-content">$0.50 per image (10 images total)</p>
          <button
            onClick={() => handleCheckout("price_1NHCdjDI1bwWeEayNsfZ8mPz")}
          >
            BUY FOR $5
          </button>
        </div>
        <div className="creds-div">
          <img
            className="creds-image"
            src={token1}
            alt="FutureBlend credit image3"
          />
          <p className="creds-content">$0.40 per image (25 images total)</p>
          <button
            onClick={() => handleCheckout("price_1NHCeaDI1bwWeEays9buan4Q")}
          >
            BUY FOR $10
          </button>
        </div>
      </section>
    </div>
  );
};

export default Buy;
