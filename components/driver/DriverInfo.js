import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const DriverInfo = ({ data, loading }) => {
  const { t } = useTranslation("driver");

  const driverInfo = [
    {
      title: t("license_number_key"),
      value: data.DLNumber,
    },
    {
      title: t("department_key"),
      value: data.Department,
    },
    {
      title: t("email_key"),
      value: data.Email,
    },
    {
      title: t("phone_number_key"),
      value: data.PhoneNumber,
    },
    {
      title: t("vehicle_name_key"),
      value: data.DisplayName,
    },
    {
      title: t("plate_number_key"),
      value: data.PlateNumber,
    },
    {
      title: t("RFID_key"),
      value: data.RFID,
    },
    {
      title: t("rating_key"),
      value: "100%",
      rate: faStar,
    },
  ];

  return (
    <Card className="shadow-sm border border-light">
      <Card.Body>
        {loading ? (
          <Spinner />
        ) : Object.keys(data).length > 0 ? (
          <Row>
            <Col md="6">
              <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                <Image
                  className="img-fluid rounded-circle card-img w-50"
                  src="/assets/images/driver.png"
                  alt="avatar"
                  layout="fixed"
                  width={200}
                  height={200}
                />
                <h4 className="text-secondary text-center mt-3">
                  {`${data.FirstName} ${data.LastName}`}
                </h4>
              </div>
            </Col>
            {/* <Col md='2'></Col> */}
            <Col md="6">
              <div className="mt-4 ms-5">
                {driverInfo?.map(({ title, value, rate }, idx) => {
                  return (
                    <p key={idx}>
                      <span className="fw-bold">{title}: </span>
                      <span className="">{value}</span>
                      {rate ? (
                        <>
                          <FontAwesomeIcon
                            style={{ color: "orange" }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{ color: "orange" }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{ color: "orange" }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{ color: "orange" }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{ color: "orange" }}
                            icon={faStar}
                            size="sm"
                          />
                        </>
                      ) : null}
                    </p>
                  );
                })}
              </div>
            </Col>
          </Row>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card.Body>
    </Card>
  );
};

export default DriverInfo;
