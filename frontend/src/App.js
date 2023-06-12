import React, { useState } from "react";
import Header from "./components/header";
import Home from "./containers/Home";
import Footer from "./components/footer";
import Generate from "./containers/Generate";
import Results from "./containers/Results";
import Buy from "./containers/Buy";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import Cookies from "./containers/Cookies";
import Terms from "./containers/Terms";
import Privacy from "./containers/Privacy";
import ScrollToTop from "./ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
library.add(faArrowUpFromBracket);

function App() {
  const [credits, setCredits] = useState(0);
  return (
    <Router>
      <ScrollToTop />
      <Header credits={credits} setCredits={setCredits} />
      <Routes>
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-use" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/success" element={<Success />} />
        <Route path="/buy" element={<Buy />} />
        <Route
          path="/results"
          element={<Results credits={credits} setCredits={setCredits} />}
        />
        <Route
          path="/generate"
          element={<Generate credits={credits} setCredits={setCredits} />}
        />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<p>Path not resolved</p>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
