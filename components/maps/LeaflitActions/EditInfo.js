import React, { useEffect, useState } from "react";
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
    DisplayName: "",
    PlateNumber: "",
  });

  const Dark = darkMode ? "bg-dark" : "";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // Add old data to the inputs
  useEffect(() => {
    const id = document
      .getElementById("EditInformationBtn")
      .getAttribute("data-id");

    if (show) {
      const Ele = VehFullData?.find((ele) => ele?.VehicleID == id);
      setData({
        DisplayName: Ele?.DisplayName,
        PlateNumber: Ele?.PlateNumber,
      });
    }
  }, [show]);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("EditInformationBtn")
      .getAttribute("data-id");

    const Index = VehFullData.findIndex((x) => x.VehicleID == id);
    const the_vehicle = VehFullData.find((ele) => ele.VehicleID == id);

    const updated_data = { ...the_vehicle, ...Data };

    axios
      .put(`${config.apiGateway.URL}dashboard/vehicles/${id}`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(updated_data),
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
        dispatch(
          UpdateVehicle([
            ...VehFullData.slice(0, Index),
            { ...updated_data },
            ...VehFullData.slice(Index + 1),
          ])
        );
      })
      .finally(() => {
        setloading(false);
        handleClose();
      });
  };

  // useEffect(() => {
  //     if (show) {
  //         setRqLoading(true);
  //         const id = document
  //             .getElementById("EditInformationBtn")
  //             .getAttribute("data-id");
  //         axios
  //             .get(`${config.apiGateway.URL}dashboard/vehicles/${id}`, {
  //                 headers: {
  //                     "Content-Type": "application/json",
  //                     Authorization: `Bearer ${user?.new_token}`,
  //                 },
  //             })
  //             .then(({ data }) => {
  //                 setData({
  //                     DisplayName: data.Vehicle[0]?.DisplayName,
  //                     PlateNumber: data.Vehicle[0]?.PlateNumber,
  //                 });
  //                 setAllData(data?.Vehicle[0]);
  //                 console.log(data?.Vehicle[0]);
  //             })
  //             .catch((er) => {
  //                 console.log(er);
  //                 toast.error(er);
  //             })
  //             .finally(() => setRqLoading(false));
  //     }
  // }, [show, user?.new_token]);
  return (
    <>
      <Button
        id="EditInformationBtn"
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
            Edit Vehicle Information
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRq}>
          <Modal.Body className={`${Dark}`}>
            <Row className="p-3 mb-3">
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="DisplayName">Display Name</Form.Label>
                  <Form.Control
                    name="DisplayName"
                    type="text"
                    id="DisplayName"
                    placeholder="Display Name"
                    value={Data.DisplayName}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        DisplayName: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="PlateNumber">Plate Number</Form.Label>
                  <Form.Control
                    name="PlateNumber"
                    type="text"
                    id="PlateNumber"
                    placeholder="Plate Number"
                    value={Data.PlateNumber}
                    onChange={(e) =>
                      setData({
                        ...Data,
                        PlateNumber: e.target.value,
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
