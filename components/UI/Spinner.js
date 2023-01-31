import React from "react";

const Spinner = () => {
  return (
    <div
      style={{ height: "245px" }}
      className="d-flex align-items-center justify-content-center fs-4 text-black-50"
    >
      <span className="spinner-border spinner-border-lg" role="status" />
    </div>
  );
};

export default Spinner;
