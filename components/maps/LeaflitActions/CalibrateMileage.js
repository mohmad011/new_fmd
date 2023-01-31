import React, { useEffect, useState } from "react";
import axios from "axios";

// Bootstrap
import { Button, Form, Modal } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import config from "config/config";
import { UpdateVehicle } from "lib/slices/StreamData";
import { toast } from "react-toastify";

export default function EditInfo() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.config.darkMode);
  const VehFullData = useSelector((state) => state.streamData.VehFullData);

  const [loading, setloading] = useState(false);
  const [Mileage, setMileage] = useState("");

  const Dark = darkMode ? "bg-dark" : "";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("CalibrateMileageBtn")
      .getAttribute("data-id");

    const Index = VehFullData.findIndex((x) => x.VehicleID == id);
    const the_vehicle = VehFullData.find((ele) => ele.VehicleID == id);

    const updated_data = { ...the_vehicle, Mileage };

    axios
      .put(`${config.apiGateway.URL}dashboard/vehicles/${id}`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ ...updated_data }),
      })
      .then(() => {
        dispatch(
          UpdateVehicle([
            ...VehFullData.slice(0, Index),
            { ...updated_data },
            ...VehFullData.slice(Index + 1),
          ])
        );
      })
      .catch((er) => {
        console.log(er);
        toast.error(er.message);
      })
      .finally(() => {
        setloading(false);
        handleClose();
      });
  };

  // Add old data to the input
  useEffect(() => {
    const id = document
      .getElementById("CalibrateMileageBtn")
      .getAttribute("data-id");
    if (show) {
      const Ele = VehFullData?.find((ele) => ele?.VehicleID == id);
      setMileage(Ele?.Mileage);
    }
  }, [show]);
  return (
    <>
      <Button
        id="CalibrateMileageBtn"
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
            <h3>Calibrate Mileage</h3>
            <p className="lead">
              the new value could take upto an hour to be reflected on the
              system
            </p>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRq}>
          <Modal.Body className={`p-3 mb-3 ${Dark}`}>
            <Form.Group className="form-group">
              <Form.Label htmlFor="Mileage">Mileage</Form.Label>
              <Form.Control
                name="Mileage"
                type="text"
                id="Mileage"
                placeholder="Mileage"
                value={Mileage}
                onChange={(e) => setMileage(e.target.value)}
                required
              />
            </Form.Group>
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
                Calibrate
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
