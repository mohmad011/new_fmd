import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Btn = ({ text, btnToggle, Styles, handleClick, children }) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 250, hide: 400 }}
    overlay={(props) => (
      <Tooltip id="button-tooltip" {...props}>
        {text}
      </Tooltip>
    )}
  >
    <button
      type="button"
      className={`border-0 mx-1 ${btnToggle && Styles.active}`}
      style={{ background: btnToggle ? "#246c66" : "#fff" }}
      onClick={handleClick}
    >
      {children}
      {/* btnToggle */}
    </button>
  </OverlayTrigger>
);

export default Btn;
