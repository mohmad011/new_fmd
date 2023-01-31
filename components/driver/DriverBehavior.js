import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCar } from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const DriverBehavior = ({ data = {}, loading }) => {
  const { t } = useTranslation("driver");

  const DriverBehavior = [
    {
      title: t("harsh_brakes_key"),
      icon: faCar,
      rate: data?.harshBrakes,
    },
    {
      title: t("rapid_accelerations_key"),
      icon: faCar,
      rate: data?.idleTime,
    },
    {
      title: t("idle_time_key"),
      icon: faCar,
      rate: data?.overSpeed,
    },
    {
      title: t("over_speed_key"),
      icon: faCar,
      rate: data?.rapidAccelerations,
    },
  ];

  return (
    <Card
      className="shadow-sm border border-light"
      style={{ height: "calc(100% - 2rem)" }}
    >
      {loading ? (
        <Spinner />
      ) : Object.keys(data).length ? (
        <Card.Body>
          <h4 className="text-secondary text-center">
            {t("driver_behavior_key")}
          </h4>
          <div className="mt-4">
            {DriverBehavior?.map(({ title, icon, rate }, idx) => {
              return (
                <p key={idx} className="d-flex justify-content-between">
                  <span>
                    <FontAwesomeIcon className="me-2" icon={icon} size="sm" />
                    <span className="fw-bold">{title}</span>: {rate}
                  </span>
                  <span className="text-align-end">
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
                  </span>
                </p>
              );
            })}
          </div>
        </Card.Body>
      ) : (
        <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
      )}
    </Card>
  );
};

export default DriverBehavior;
