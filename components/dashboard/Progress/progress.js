import React, { useEffect } from "react";

const Progress = (props) => {
  useEffect(() => {
    if(props.value) {
      //progressbar
      const progressBarInit = (elem) => {
        const currentValue = elem.getAttribute("aria-valuenow");
        elem.style.width = "0%";
        elem.style.transition = "width 1.5s";
        setTimeout(() => {
          elem.style.width = currentValue + "%";
        }, 50);
      };
      const customProgressBar = document.querySelectorAll(
        '[data-toggle="progress-bar"]'
      );
      Array.from(customProgressBar, (elem) => {
        return progressBarInit(elem);
      });
    }
  }, [props.value]);
  return (
    <>
      <div
        className={`progress bg-soft-${props.softcolors} ${props.className}`}
        style={props.style}
      >
        <div
          className={`progress-bar bg-${props.color}`}
          data-toggle="progress-bar"
          role="progressbar"
          aria-valuenow={props.value}
          aria-valuemin={props.minvalue}
          aria-valuemax={props.maxvalue}
        />
      </div>
    </>
  );
};
export default Progress;
