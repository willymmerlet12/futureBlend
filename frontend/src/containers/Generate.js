import React from "react";
import Task from "../task";

const Generate = () => {
  return (
    <div>
      <Task token={sessionStorage.getItem("accessToken")} />
    </div>
  );
};

export default Generate;
