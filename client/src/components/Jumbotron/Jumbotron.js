import React from "react";

const Jumbotron = ({ children }) => (
  <div
    style={{ height: 200, clear: "both", paddingTop: 40, textAlign: "center" }}
    className="jumbotron"
  >
    {children}
  </div>
);

export default Jumbotron;
