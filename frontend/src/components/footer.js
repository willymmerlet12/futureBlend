import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-section">
          <div className="copyright">
            <p>© 2023 WMer Solutions, LLC</p>
            <p>sneakit12@gmail.com</p>
          </div>
          <div className="terms">
            <ul>
              <Link to="/privacy-policy">
                <li>Privacy Policy</li>
              </Link>
              <Link to="terms-of-use">
                <li>Terms of Use</li>
              </Link>
              <Link to="/cookies">
                <li>Cookies Preferences</li>
              </Link>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
