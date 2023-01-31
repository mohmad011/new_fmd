import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import DProgress from "components/dashboard/Progress/dProgress";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const VehicleUtilization = ({ data, loading }) => {
  const { t } = useTranslation(["vehicle"]);

  const cardData = [
    {
      duration: 4,
      name: t("mileage_key"),
      countStart: 0,
      countEnd: Math.floor(+data?.Mileages) || 0,
      color: "primary",
    },
    {
      duration: 4,
      name: t("working_hour_key"),
      countStart: 0,
      countEnd: Math.floor(+data?.w_Houres) || 0,
      color: "success",
    },
    {
      duration: 4,
      name: t("fuel_consumption_key"),
      countStart: 0,
      countEnd: Math.floor(+data?.Fuel) || 0,
      color: "info",
    },
    {
      duration: 4,
      name: t("parking_key"),
      countStart: 0,
      countEnd: Math.floor(+data?.Parking) || 0,
      color: "danger",
    },
  ];

  return (
    <Col md="12" lg="6">
      <Card
        style={{
          height: "calc(100% - 2rem)",
        }}
      >
        {loading ? (
          <Spinner />
        ) : Object.keys(data).length ? (
          <Card.Body className="">
            <Row>
              {cardData.map((item) => (
                <Col md="6" key={item.name}>
                  <Card
                    className={`bg-soft-${item.color}`}
                    style={{ margin: "16px auto" }}
                  >
                    <Card.Body>
                      <DProgress
                        duration={item.duration}
                        name={[`${item.name}`]}
                        countStart={[item.countStart]}
                        countEnd={[item.countEnd]}
                        progresCount={item.progresCount}
                        color={item.color}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card>
    </Col>
  );
};

export default VehicleUtilization;
