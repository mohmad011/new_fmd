import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const VehicleBehavior = ({ data, loading }) => {
  const { t } = useTranslation(["vehicle"]);

  return (
    <Col md="6" lg="3">
      <Card style={{ paddingLeft: "20px",paddingRight: "20px", height: "calc(100% - 2rem)" }}>
        {loading ? (
          <Spinner />
        ) : Object.keys(data).length ? (
          <Card.Body className="ps-0">
            <h4 className="mb-4">{t("vehicle_behavior_key")}</h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <Image
                alt="logos"
                src="https://track.saferoad.net/Images/drivers/Harsh%20Brake.png"
                width="40"
                height="40"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">{t("harsh_brakes_key")}= {data?.harshBrakes}</h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <Image
                alt="logos"
                src="https://track.saferoad.net/Images/drivers/Acceleration.png"
                width="40"
                height="40"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">
                {t("rapid_accelerations_key")}= {data?.rapidAccelerations}
              </h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <Image
                alt="logos"
                src="https://track.saferoad.net/Images/drivers/Idle%20Time.png"
                width="40"
                height="40"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">{t("idle_time_key")}= {data?.idleTime}</h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <Image
                alt="logos"
                src="https://track.saferoad.net/Images/drivers/Over%20Speed.png"
                width="40"
                height="40"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">{t("over_speed_key")}= {data?.overSpeed}</h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
              }}
            >
              <Image
                alt="logos"
                src="https://track.saferoad.net/Images/icons8-star-64.png"
                width="40"
                height="40"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">
                {t("rating_key")}= 100%{" "}
                {
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
                }
              </h5>
            </div>
          </Card.Body>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card>
    </Col>
  );
};

export default VehicleBehavior;
