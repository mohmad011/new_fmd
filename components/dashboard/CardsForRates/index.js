import React from "react";
import { Card, Col } from "react-bootstrap";
import Styles from "../../../styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";
import Stars from "../Stars";
import Spinner from "components/UI/Spinner";
import Link from "next/link";
import { useSelector } from "react-redux";
export default function Index({ data, loading }) {
  const darkMode = useSelector((state) => state.config.darkMode);
  const topRated = data?.topRatedDrivers || [];
  const BadRated = data?.BadRatedDrivers || [];
  const { t } = useTranslation("dashboard");
  return (
    <>
      {/* #######################  Drivers  ####################  */}
      {/* Top Drivers */}
      <Col md="6" lg="3">
        <Card style={{height:'calc(100% - 2rem)'}}>
          <Card.Header className="d-flex justify-content-center align-items-center">
            <div className="header-title  text-center">
              <h4 className={"card-title " + Styles.head_title}>
                {t("top_drivers_key")}
              </h4>
            </div>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <Spinner />
            ) : topRated.length > 0 ? (
              <div>
                {new Array(2).fill({}).map((e, i) => {
                  const driverId = topRated[i]?.DriverID;
                  const driverName = topRated[i]?.DriverName;
                  if (driverId) {
                    return (
                      <Link
                        key={driverId}
                        href={{
                          pathname: `/driver/[driverId]`,
                          query: { driverId: driverId },
                        }}
                      >
                        <a>
                          <Stars
                            name={driverName}
                            imgSrc={"/assets/images/avatars/01.png"}
                            imgAlt={driverName}
                            starsCount={5}
                            id={driverId}
                            type={t('driver_id_key')}
                          />
                        </a>
                      </Link>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}
                      >
                        {t("no_driver_to_show_key")}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div  className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}>
                {t("no_drivers_to_show_key")}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
      {/* Worst Drivers */}
      <Col md="6" lg="3">
      <Card style={{height:'calc(100% - 2rem)'}}>
          <Card.Header className="d-flex justify-content-center align-items-center">
            <div className="header-title  text-center">
              <h4 className={"card-title " + Styles.head_title}>
                {t("worst_drivers_key")}
              </h4>
            </div>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <Spinner />
            ) : BadRated.length > 0 ? (
              <div>
                {new Array(2).fill({}).map((e, i) => {
                  const driverId = BadRated[i]?.DriverID;
                  const driverName = BadRated[i]?.DriverName;
                  if (driverId) {
                    return (
                      <Link
                        key={driverId}
                        href={{
                          pathname: `/driver/[driverId]`,
                          query: { driverId: driverId },
                        }}
                      >
                        <a>
                          <Stars
                            name={driverName}
                            imgSrc={"/assets/images/avatars/01.png"}
                            imgAlt={driverName}
                            starsCount={1}
                            id={driverId}
                            type={t('driver_id_key')}
                          />
                        </a>
                      </Link>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        style={{height:'80px'}}
                        className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}
                      >
                        {t("no_driver_to_show_key")}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div 
                style={{height:'80px'}}  
                className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}>
                {t("no_drivers_to_show_key")}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
      {/* #######################  Vehicles  ####################  */}
      {/* Top Utilized Vehicles */}
      <Col md="6" lg="3">
        <Card style={{height:'calc(100% - 2rem)'}}>
          <Card.Header className="d-flex justify-content-center align-items-center">
            <div className="header-title  text-center">
              <h4 className={"card-title " + Styles.head_title}>
                {t("top_utilized_vehicles_key")}
              </h4>
            </div>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <Spinner />
            ) : topRated.length > 0 ? (
              <div>
                {new Array(2).fill({}).map((e, i) => {
                  const vehicleName = topRated[i]?.DisplayName;
                  if (vehicleName) {
                    return (
                      <Link
                        key={vehicleName}
                        href={{
                          pathname: `/vehicle/[vehicleId]`,
                          query: { vehicleId: topRated[i]?.VehicleID },
                        }}
                      >
                        <a>
                          <Stars
                            key={i}
                            name={vehicleName}
                            imgSrc={"/assets/images/741407.png"}
                            imgAlt={vehicleName}
                            starsCount={5}
                            id={topRated[i]?.VehicleID}
                            type={t('vehicle_id_key')}
                          />
                        </a>
                      </Link>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        style={{height:'80px'}}
                        className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}
                      >
                        {t("no_vehicle_to_show_key")}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div 
                style={{height:'80px'}}
                className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}>
                {t("no_vehicles_to_show_key")}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
      {/* Worst Utilized Vehicles */}
      <Col md="6" lg="3">
        <Card style={{height:'calc(100% - 2rem)'}}>
          <Card.Header className="d-flex justify-content-center align-items-center">
            <div className="header-title text-center">
              <h4 className={"card-title " + Styles.head_title}>
                {t("worst_utilized_vehicles_key")}
              </h4>
            </div>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <Spinner />
            ) : BadRated.length > 0 ? (
              <div>
                {new Array(2).fill({}).map((e, i) => {
                  const vehicleName = BadRated[i]?.DisplayName;
                  if (vehicleName) {
                    return (
                      <Link
                        key={vehicleName}
                        href={{
                          pathname: `/vehicle/[vehicleId]`,
                          query: { vehicleId: BadRated[i]?.VehicleID },
                        }}
                      >
                        <a>
                          <Stars
                            key={i}
                            name={vehicleName}
                            imgSrc={"/assets/images/741407.png"}
                            imgAlt={vehicleName}
                            starsCount={1}
                            id={BadRated[i]?.VehicleID}
                            type={t('vehicle_id_key')}
                          />
                        </a>
                      </Link>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        style={{height:'80px'}}
                        className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}
                      >
                        {t("no_vehicle_to_show_key")}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div 
                style={{height:'80px'}}
                className={`border border-1 border-light rounded-1 text-${darkMode ? 'light' : 'dark'} text-center  mb-3 py-4 px-3`}>
                {t("no_vehicles_to_show_key")}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
