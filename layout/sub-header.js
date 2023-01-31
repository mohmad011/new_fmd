import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import Image from "next/image";
const SubHeader = ({ pageName = "" }) => {
  const { t } = useTranslation("main");

  const [state, setState] = useState("");
  useEffect(() => {
    switch (pageName) {
      case "/":
        setState("dashboard_key");
        break;
      case "/preventive-maintenance":
        setState("preventive_maintenance_key");
        break;
      case "/preventive-maintenance/add":
        setState("add_maintenance_plan_key");
        break;
      case "/preventive-maintenance/edit/[editId]":
        setState("update_maintenance_plan_key");
        break;
      case "/preventive-maintenance/view-history":
        setState("view_history_key");
        break;
      case "/drivers-management":
        setState("operate_driver_key");
        break;
      case "/drivers-management/add":
        setState("add_driver_key");
        break;
      case "/drivers-management/edit/[editId]":
        setState("update_driver_key");
        break;
      case "/drivers-management/showVehicles/[showId]":
        setState("show_vehicles_key");
        break;
      case "/driver/[driverId]":
        setState("driver_dashboard_key");
        break;
      case "/vehicle/[vehicleId]":
        setState("vehicle_dashboard_key");
        break;
      case "/management":
        setState("management_key");
        break;
      case "/management/vehicle-management":
        setState("vehicle_management_key");
        break;
      case "/management/vehicle-management/add/vehicle-data":
        setState("add_vehicle_key");
        break;
      case "/management/vehicle-management/add/add-device":
        setState("add_device_to_vehicle_key");
        break;
      case "/management/vehicle-management/add/add-sim":
        setState("add_SIM_to_vehicle's_device_key");
        break;
      case "/management/vehicle-management/add/add-group":
        setState("add_vehicle_to_group_key");
        break;
      case "/management/vehicle-management/edit/[editId]":
        setState("update_vehicle_information_key");
        break;
      case "/management/sim-management":
        setState("SIM_cards_management_key");
        break;
      case "/management/sim-management/add":
        setState("add_SIM_card_key");
        break;
      default:
        setState("");
        break;
    }
  }, [pageName]);
  return (
    <>
      <div className="iq-navbar-header" style={{ height: "153px" }}>
        <Container fluid className=" iq-container">
          <Row>
            <Col md="12">
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <h1
                    style={{
                      fontSize: "46px",
                      lineHeight: "62px",
                    }}
                  >
                    {t(state)}
                  </h1>
                </div>
                <div className="d-flex align-items-center"></div>
              </div>
            </Col>
          </Row>
        </Container>
        {/* {{!-- rounded-bottom if not using animation --}} */}
        <div className="iq-header-img">
          <Image
            quality={100}
            layout="fill"
            src="/assets/images/top-header.jpg"
            alt="header"
            className="img-fluid w-100 h-100 animated-scaleX"
          />
        </div>
      </div>
    </>
  );
};

export default SubHeader;
