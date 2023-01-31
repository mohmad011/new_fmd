import React, { useState } from "react";
import axios from "axios";

// Bootstrap
import { Button, Form, FormControl, FormSelect, Modal, Row } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import config from "config/config";
import { toast } from "react-toastify";

export default function SubmitACommand() {
  const [SelectB, setSelectB] = useState("SetTimeInterval");
  const darkMode = useSelector((state) => state.config.darkMode);
  const [loading, setloading] = useState(false);

  const [Data, setData] = useState({
    SetTimeInterval: "",
    SetTimeIntervalWhenEngineOff: "",
    SetDirectionChangeInterval: "",
    SetOverSpeed: "",
    SetParkingOverTime: "",
    SetMileage: "",
    SetIdlingOverTime: "",
    SetTrailingRadius: "",
    SetDistanceInterval: "",
    SetOverSpeedForDuration: {},
    SetFatigueDriving: {},
  });

  const UpdateDataOneInput = (e) => {
    const { name, value } = e.target;
    setData({
      ...Data,
      [name]: value,
    });
  };
  const UpdateDataTwoInputs = (e) => {
    const { name, value, id } = e.target;
    setData({
      ...Data,
      [id]: {
        ...Data[id],
        [name]: value,
      },
    });
  };

  const Dark = darkMode ? "bg-dark" : "";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("SubmitACommandBtn")
      .getAttribute("data-id");

    axios
      .put(`${config.apiGateway.URL}dashboard/vehicles/${id}`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(id),
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((er) => {
        toast.error(er.message);
      })
      .finally(() => {
        setloading(false);
        handleClose();
      });
  };

  return (
    <>
      <Button
        id="SubmitACommandBtn"
        className="d-none"
        onClick={() => setShow(true)}
      >
        Launch demo modal
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton className={`${Dark}`}>
          <Modal.Title id="contained-modal-title-vcenter">
            Submit A Command
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRq}>
          <Modal.Body className={`${Dark}`}>
            <Row className="p-3 mb-3">
              <FormControl fullWidth>
                <FormSelect
                  label="Age"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={SelectB}
                  // defaultValue="SetTimeInterval"
                  onChange={(e) => setSelectB(e.target.value)}
                >
                  {[
                    {
                      label: "Set Time Interval",
                      id: "SetTimeInterval",
                    },
                    {
                      label: "Set Time Interval When EngineOff",
                      id: "SetTimeIntervalWhenEngineOff",
                    },
                    {
                      label: "Take Picture",
                      id: "TakePicture",
                    },
                    {
                      label: "Set Direction Change Interval",
                      id: "SetDirectionChangeInterval",
                    },
                    {
                      label: "Set Over Speed",
                      id: "SetOverSpeed",
                    },
                    {
                      label: "Set Over Speed For Duration",
                      id: "SetOverSpeedForDuration",
                    },
                    {
                      label: "Set Parking Over Time",
                      id: "SetParkingOverTime",
                    },
                    {
                      label: "Set Mileage",
                      id: "SetMileage",
                    },
                    {
                      label: "Set Idling Over Time",
                      id: "SetIdlingOverTime",
                    },
                    {
                      label: "Set Trailing Radius",
                      id: "SetTrailingRadius",
                    },
                    {
                      label: "Set Fatigue Driving",
                      id: "SetFatigueDriving",
                    },
                    {
                      label: "Set Distance Interval",
                      id: "SetDistanceInterval",
                    },
                    { label: "Locate", id: "Locate" },
                    {
                      label: "Cancel Alarms",
                      id: "CancelAlarms",
                    },
                    {
                      label: "Demobilize",
                      id: "Demobilize",
                    },
                    { label: "Mobilize", id: "Mobilize" },
                    {
                      label: "Check RFID",
                      id: "CheckRFID",
                    },
                    { label: "Open Door", id: "OpenDoor" },
                    {
                      label: "Close Door",
                      id: "CloseDoor",
                    },
                  ]?.map((ele, key) => (
                    <p value={ele.id} key={key}>
                      {ele.label}
                    </p>
                  ))}
                </FormSelect>
              </FormControl>
            </Row>
            <Row className="">
              {[
                {
                  label: "Time",
                  id: "SetTimeInterval",
                },
                {
                  label: "Time",
                  id: "SetTimeIntervalWhenEngineOff",
                },
                {
                  label: "Degrees",
                  id: "SetDirectionChangeInterval",
                },
                { label: "Speed", id: "SetOverSpeed" },
                {
                  label: "Speed",
                  labelTwo: "Duration",
                  id: "SetOverSpeedForDuration",
                },
                { label: "Time", id: "SetParkingOverTime" },
                { label: "Mileage", id: "SetMileage" },
                { label: "Time", id: "SetIdlingOverTime" },
                { label: "Meters", id: "SetTrailingRadius" },

                {
                  label: "Driving Time",
                  labelTwo: "Rest Time",
                  id: "SetFatigueDriving",
                },
                {
                  label: "Distance",
                  id: "SetDistanceInterval",
                },
              ]?.map((ele, key) => {
                return (
                  <div key={key}>
                    {!ele?.labelTwo ? (
                      <InputCom
                        id={ele.id}
                        label={ele.label}
                        key={ele.id}
                        val={Data}
                        fun={UpdateDataOneInput}
                        SelectB={SelectB}
                      />
                    ) : (
                      <InputsCom
                        id={ele.id}
                        label={ele.label}
                        labelTwo={ele.labelTwo}
                        key={ele.id}
                        val={Data}
                        fun={UpdateDataTwoInputs}
                        SelectB={SelectB}
                      />
                    )}
                  </div>
                );
              })}
            </Row>
          </Modal.Body>
          <Modal.Footer className={`${Dark}`}>
            <div className="d-flex justify-content-around">
              <button
                disabled={loading}
                className="btn btn-primary px-3 py-2 ms-3"
                type="submit"
              >
                {!loading ? (
                  <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
                ) : (
                  <FontAwesomeIcon
                    className="mx-2 fa-spin"
                    icon={faSpinner}
                    size="sm"
                  />
                )}
                Save
              </button>
              <button
                className="btn btn-primary px-3 py-2 ms-3"
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                }}
              >
                <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
                Cancel
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export const InputCom = ({ val, fun, label, id, type = "text", SelectB }) => {
  return SelectB === id ? (
    <>
      <Form.Group className="form-group">
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Control
          name={id}
          type={type}
          id={id}
          placeholder={label}
          value={val[id]}
          onChange={fun}
        />
      </Form.Group>
    </>
  ) : null;
};

export const InputsCom = ({
  val,
  fun,
  label,
  labelTwo,
  id,
  type = "text",
  SelectB,
}) => {
  return SelectB === id ? (
    <>
      <Form.Group className="form-group">
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Control
          name={label}
          type={type}
          id={id}
          placeholder={label}
          value={val[id][label]}
          onChange={fun}
        />
      </Form.Group>
      <Form.Group className="form-group">
        <Form.Label htmlFor={id}>{labelTwo}</Form.Label>
        <Form.Control
          name={labelTwo}
          type={type}
          id={id}
          placeholder={labelTwo}
          value={val[id][labelTwo]}
          onChange={fun}
        />
      </Form.Group>
    </>
  ) : null;
};
