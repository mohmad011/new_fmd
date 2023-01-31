import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  faCar,
  faCheck,
  faPlus,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import axios from "axios";
import config from "../../../../config/config";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import useToken from "../../../../hooks/useToken";
import { CustomInput } from "../../../../components/CustomInput";
import CustomSelectBox from "../../../../components/CustomSelectBox";
import { CustomCheckBox } from "../../../../components/CustomCheckBox";

export default function EditAccessories() {
  const router = useRouter();
  const {
    config: { darkMode },
    auth: { user },
  } = useSelector((state) => state);

  const { id } = router.query;
  const [loading, setloading] = useState(false);
  const [Rqloading, setRqloading] = useState(false);

  const [validated, setValidated] = useState(false);
  const [Data, setData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...Data,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setRqloading(true);
      await axios(`${config.apiGateway.URL}dashboard/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.new_token}`,
        },
        data: Data,
      })
        .then(() => {
          toast.success("Vehicle Updated Successfully.");
        })
        .catch((error) => {
          toast.error(`Error: ${error?.message}`);
        })
        .finally(() => {
          setRqloading(false);
          router.push("/management/vehicle-management");
        });
    }
    setValidated(true);
  };

  useEffect(() => {
    setloading(true);
    user?.new_token &&
      (async function () {
        await axios
          .get(`${config.apiGateway.URL}dashboard/vehicles/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.new_token}`,
            },
          })
          .then(({ data }) => {
            setData({ ...data });
          })
          .catch((err) => {
            toast.error(err.message);
            console.log(err);
          })
          .finally(() => {
            setloading(false);
          });
      })();
  }, [user?.new_token]);
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {loading ? (
          <h3 className="text-center pt-5 pb-5">loading...</h3>
        ) : (
          <Row>
            <Card>
              <Card.Header className="h3">
                Edit Vehicle ({Data?.DisplayName})
              </Card.Header>
              <Card.Body>
                <Row>
                  <CustomInput
                    disabled={true}
                    value={Data.DisplayName}
                    handleChange={handleChange}
                    Name="DisplayName"
                    Label="Display Name"
                  />
                  <CustomInput
                    disabled={true}
                    value={Data.PlateNumber}
                    handleChange={handleChange}
                    Name="PlateNumber"
                    Label="Plate Number"
                  />
                  <CustomInput
                    disabled={true}
                    value={Data.PlateType}
                    handleChange={handleChange}
                    Name="PlateType"
                    Label="PlateType"
                  />
                  <CustomInput
                    disabled={true}
                    value={Data.PlateNumber}
                    handleChange={handleChange}
                    Name="PlateNumber"
                    Label="Plate Number"
                  />
                </Row>
              </Card.Body>
            </Card>
            <hr />
            <Card>
              <Card.Header>
                <h4>Accessories Information</h4>
              </Card.Header>
              <Card.Body>
                <div className="form-group">
                  <Button
                    className="px-3 py-2 d-inline-block"
                    onClick={(e) => {
                      console.log("gg");
                    }}
                  >
                    <FontAwesomeIcon className="mx-2" icon={faPlus} size="sm" />
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Row>
        )}
        <Row>
          <div className="w-25 d-flex justify-content-between flex-wrap flex-md-nowrap">
            <Button
              type="submit"
              disabled={loading}
              className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
            >
              {!Rqloading ? (
                <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
              ) : (
                <FontAwesomeIcon
                  className="mx-2 fa-spin"
                  icon={faSpinner}
                  size="sm"
                />
              )}
              Save
            </Button>
            <Button
              className="px-3 py-2 text-nowrap me-3 ms-0 ms-md-3"
              onClick={(e) => {
                e.preventDefault();
                router.push("/driversManagement");
              }}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              Cancel
            </Button>
          </div>
        </Row>
      </Form>
    </>
  );
}

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main","management"])),
    },
  };
}
// translation ##################################
