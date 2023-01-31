import React, { useState } from "react";

// Bootstrap
import { Button, Form, Modal } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import axios from "axios";
import config from "config/config";
import { toast } from "react-toastify";

export default function DisableVehicle() {
  const darkMode = useSelector((state) => state.config.darkMode);

  const Dark = darkMode ? "bg-dark" : "";
  const [loading, setloading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("DisableVehicleBtn")
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
        id="DisableVehicleBtn"
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
        centered
      >
        <Modal.Header closeButton className={`${Dark}`}>
          <Modal.Title id="contained-modal-title-vcenter">
            <p className="lead">
              Are you sure you want to disable this Vehicle ?
            </p>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRq}>
          <Modal.Footer className={`d-flex justify-content-center ${Dark}`}>
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
              Yes
            </button>
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              No
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
