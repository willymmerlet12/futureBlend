import React from "react";

const Cookies = () => {
  return (
    <>
      <div className="cookies-container">
        <h1>Manage cookies</h1>
        <p>
          Cookies are small text files that are stored on your device when you
          visit a website. They serve various purposes, including enhancing your
          user experience, analyzing user interactions, and personalizing
          content and advertisements.
        </p>
        <p>
          You have the option to manage your cookie preferences below. However,
          please keep in mind that disabling certain cookies may restrict your
          access to specific features on our website.
        </p>
        <h1>Cookies we use</h1>
        <p>
          At our website, we utilize cookies to enhance your browsing experience
          and gain insights into how visitors interact with our content. Below,
          you will find the types of cookies we employ:
        </p>
        <h2>Stripe</h2>
        <p>
          We have partnered with Stripe, a trusted payment gateway that enables
          secure and seamless online transactions. When users make payments on
          our website through Stripe, their payment information, such as credit
          card details, is stored temporarily for the duration of the payment
          processing. To ensure the smooth functioning of the payment process,
          Stripe utilizes cookies to store essential session information,
          including session ID and payment status. <br /> <br /> These cookies
          are vital for the proper operation of the payment system and remain on
          the user's browser until the payment process is completed. Apart from
          payment-related cookies, Stripe may employ additional cookies on our
          website to enhance performance, analyze user interactions, and deliver
          relevant advertisements. However, these supplementary cookies are
          optional, and you have the flexibility to disable them according to
          your preferences. <br /> <br /> Please refer to Stripe's cookie
          settings (https://stripe.com/cookie-settings) to customize your Stripe
          cookies as per your requirements. It's important to note that Stripe's
          use of cookies is governed by their own privacy policy, which we
          encourage you to review to address any specific concerns you may have.
        </p>
        <h2>Google Analytics</h2>
        <p>
          At FutureBlend, we utilize Google Analytics to gather valuable
          insights into the usage patterns of our website visitors. This
          information plays a crucial role in generating comprehensive reports
          that guide us in improving our website and enhancing the overall user
          experience. <br /> The Google Analytics cookies we employ enable us to
          collect data in an anonymous format. This includes statistics such as
          the number of visitors to our website and blog, the origin of their
          arrival on our site, and the specific pages they explore during their
          visit. <br />
          <br /> By analyzing this anonymized data, we gain valuable insights
          into user behavior and preferences, allowing us to optimize our
          website content and structure accordingly. It helps us tailor our
          offerings to better meet the needs of our visitors and create a more
          engaging and personalized browsing experience. <br /> Rest assured
          that the data collected through Google Analytics cookies does not
          identify you personally. It is used solely for analytical purposes and
          to improve our website's performance. If you have any concerns
          regarding the use of Google Analytics cookies, please feel free to
          reach out to us.
        </p>
        <h2>Authentication</h2>
        <p>
          At FutureBlend, we leverage the power of Firebase Authentication to
          provide a seamless user authentication experience on our application.
          Firebase Authentication offers a comprehensive set of features that
          allow users to sign up and log in using various third-party services,
          including Google. <br /> With Firebase Authentication, our users can
          conveniently authenticate themselves using their existing Google
          accounts, making it quick and hassle-free to get started with our
          application. Firebase Authentication ensures the security and
          integrity of user credentials, providing a reliable authentication
          mechanism for our users. <br /> By utilizing Firebase Authentication,
          we can focus on delivering a user-friendly experience while delegating
          the authentication process to a trusted and robust service. This
          allows us to streamline the onboarding process and provide a smooth
          and secure environment for our users to interact with our application.
        </p>
      </div>
      <p></p>
    </>
  );
};

export default Cookies;
