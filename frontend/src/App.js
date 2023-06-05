import React from "react";
import Header from "./components/header";
import Home from "./containers/Home";
import Footer from "./components/footer";
import Generate from "./containers/Generate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
library.add(faArrowUpFromBracket);

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/generate" element={<Generate />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
