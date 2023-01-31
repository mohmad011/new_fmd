import React from "react";

const Loader = () => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center w-100 h-100 min-vh-100">
        <div dir="auto" className="custom-loader-animation">
          <span>S</span>
          <span>A</span>
          <span>F</span>
          <span>E</span>
          <span>R</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>

        </div>
      </div>
    </>
  );
};
export default Loader;
