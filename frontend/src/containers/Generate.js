import React from "react";
import Task from "../task";
import { Helmet } from "react-helmet";

const Generate = ({ credits, setCredits }) => {
  return (
    <div>
      <Helmet>
        ‍
        <title>
          Future Blend AI - Generate Now Realistic Images of Your Potential
          Offspring
        </title>
        <meta
          name="description"
          content="Visualize the Future: Generate Realistic Images of Your Potential
          Offspring with Future Blend AI."
        />
        <link rel="canonical" href="http://futureblendai.com/generate" />
      </Helmet>
      <Task
        token={sessionStorage.getItem("accessToken")}
        credits={credits}
        setCredits={setCredits}
      />
    </div>
  );
};

export default Generate;
