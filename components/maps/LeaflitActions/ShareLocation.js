import React, { useState } from "react";
import axios from "axios";

// Bootstrap
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { UpdateVehicle } from "lib/slices/StreamData";
import { toast } from "react-toastify";

export default function EditInfo() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.config.darkMode);
  const VehFullData = useSelector((state) => state.streamData.VehFullData);

  const [loading, setloading] = useState(false);
  const [Data, setData] = useState({
    Email: "",
    PhoneNumber: "",
  });

  const Dark = darkMode ? "bg-dark" : "";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("ShareLocationBtn")
      .getAttribute("data-id");

    const Index = VehFullData.findIndex((x) => x.VehicleID == id);
    const the_vehicle = VehFullData.find((ele) => ele.VehicleID == id);

    const updated_data = { ...the_vehicle, ...Data };
    dispatch(
      UpdateVehicle([
        ...VehFullData.slice(0, Index),
        { ...updated_data },
        ...VehFullData.slice(Index + 1),
      ])
    );
    axios
      .put(`https://jsonplaceholder.typicode.com/posts/1`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ ...updated_data }),
      })
      .then(({ data }) => {
        console.log(data);
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
        id="ShareLocationBtn"
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
            Share Location
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRq}>
          <Modal.Body className={`${Dark}`}>
            <Row className="p-3 mb-3">
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="Email">Email</Form.Label>
                  <Form.Control
                    name="Email"
                    type="email"
                    id="Email"
                    placeholder="john@smith.com"
                    value={Data.Email}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        Email: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="PhoneNumber">Phone Number</Form.Label>
                  <Form.Control
                    name="PhoneNumber"
                    type="tel"
                    id="PhoneNumber"
                    placeholder="+966123456789"
                    value={Data.PhoneNumber}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        PhoneNumber: e.target.value,
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
                Share
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
