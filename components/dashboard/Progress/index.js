import { useTranslation } from "next-i18next";
import React from "react";
import { Card, Col } from "react-bootstrap";
import DProgress from "./dProgress";

export default function Index({ VehTotal }) {
  const { t } = useTranslation("dashboard");
  const totalVehs = VehTotal?.totalVehs || 0;
  const ActiveVehs = VehTotal?.activeVehs || 0;
  const PercentageActiveVehcles =
    ((ActiveVehs * 100) / totalVehs).toFixed(1) || 0;

  const OfflineVehs = VehTotal?.offlineVehs || 0;
  const PercentageOfflineVehs =
    ((OfflineVehs * 100) / totalVehs).toFixed(1) || 0;

  const AllDrivers = VehTotal?.totalDrivers || 0;
  const ActiveDrivers = VehTotal?.activeDrivers || 0;
  const PercentageActiveDrivers =
    ((ActiveDrivers * 100) / AllDrivers).toFixed(1) || 0;

  return (
    <>
      <Col sm="12">
        <Card>
          <Card.Body>
            <DProgress
              duration={1.5}
              name={[t("active_vehicles_key"), t("total_vehicles_key")]}
              countStart={[0, 0]}
              countEnd={[ActiveVehs, totalVehs]}
              dateType={t("monthly_key")}
              progresCount={PercentageActiveVehcles}
              color={"primary"}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col sm="12">
        <Card>
          <Card.Body>
            <DProgress
              duration={1.5}
              name={[t("offline_vehicles_key")]}
              countStart={[0]}
              countEnd={[OfflineVehs]}
              dateType={t("annual_key")}
              progresCount={PercentageOfflineVehs}
              color={"warning"}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col sm="12">
        <Card>
          <Card.Body>
            <DProgress
              duration={1.5}
              name={[t("active_drivers_key"), t("total_drivers_key")]}
              countStart={[0, 0]}
              countEnd={[ActiveDrivers, AllDrivers]}
              dateType={t("today_key")}
              progresCount={PercentageActiveDrivers}
              color={"danger"}
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
