import React from "react";
import gif from "../../../assets/giphy.gif";
import "./loader.css";
import { createPortal } from "react-dom";

const Loader = () => {
  return createPortal(
    <div className="wrapper">
      <div className="loader">
        <img src={gif} alt="Loading..." />
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default Loader;
