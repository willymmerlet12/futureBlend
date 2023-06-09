import React from "react";
import { useLocation } from "react-router-dom";
import Task from "../task";

const Results = () => {
  const location = useLocation();
  const results = location.state.result;

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = results[results.length - 1].uri;
    link.download = "generated_image.png";
    link.target = "_blank";

    // Simulate a click event to trigger the download
    link.dispatchEvent(new MouseEvent("click"));
  };

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
