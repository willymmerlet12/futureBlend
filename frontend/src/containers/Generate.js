import React from "react";
import Task from "../task";

const Generate = ({ credits, setCredits }) => {
  return (
    <div>
      <Task
        token={sessionStorage.getItem("accessToken")}
        credits={credits}
        setCredits={setCredits}
      />
    </div>
  );
};

export default Generate;
