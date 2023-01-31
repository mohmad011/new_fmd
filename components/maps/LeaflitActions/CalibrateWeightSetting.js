import React, { useState } from "react";
import axios from "axios";

// Bootstrap
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

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
  const [Data, setData] = useState({
    HeadWeight: "",
    TailWeight: "",
    MinimumVoltage: "",
    MaximumVoltage: "",
    CargoWeight: "",
  });

  const Dark = darkMode ? "bg-dark" : "";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("CalibrateWeightSettingBtn")
      .getAttribute("data-id");

    const Index = VehFullData.findIndex((x) => x.VehicleID == id);
    const the_vehicle = VehFullData.find((ele) => ele.VehicleID == id);

    const updated_data = { ...the_vehicle, ...Data };

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
  return (
    <>
      <Button
        id="CalibrateWeightSettingBtn"
        className="d-none"
        onClick={() => setShow(true)}
      >
        Launch demo modal
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton className={`${Dark}`}>
          <Modal.Title id="contained-modal-title-vcenter">
            Calibrate Weight Setting
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRq}>
          <Modal.Body className={`${Dark}`}>
            <Row className="p-3 mb-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="HeadWeight">Head Weight</Form.Label>
                  <Form.Control
                    name="HeadWeight"
                    type="text"
                    id="HeadWeight"
                    placeholder="Head Weight"
                    value={Data.HeadWeight}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        HeadWeight: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="TailWeight">Tail Weight</Form.Label>
                  <Form.Control
                    name="TailWeight"
                    type="text"
                    id="TailWeight"
                    placeholder="Tail Weight"
                    value={Data.TailWeight}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        TailWeight: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="MinimumVoltage">
                    Minimum Voltage
                  </Form.Label>
                  <Form.Control
                    name="MinimumVoltage"
                    type="text"
                    id="MinimumVoltage"
                    placeholder="Minimum Voltage"
                    value={Data.MinimumVoltage}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        MinimumVoltage: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="MaximumVoltage">
                    Maximum Voltage
                  </Form.Label>
                  <Form.Control
                    name="MaximumVoltage"
                    type="text"
                    id="MaximumVoltage"
                    placeholder="Maximum Voltage"
                    value={Data.MaximumVoltage}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        MaximumVoltage: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="CargoWeight">Cargo Weight</Form.Label>
                  <Form.Control
                    name="CargoWeight"
                    type="text"
                    id="CargoWeight"
                    placeholder="Cargo Weight"
                    value={Data.CargoWeight}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        CargoWeight: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
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
                Save Changes
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
