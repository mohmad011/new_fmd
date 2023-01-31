import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUserClock,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  fetchDriverData,
  fetchOverSpeedStatistics,
  fetchWeeklyTripsAndFuel,
  fetchUtzStatisticsAndBehavior,
} from "services/driver";
import { toast } from "react-toastify";
import DriverInfo from "components/driver/DriverInfo";
import DriverSpeedStatisticsChart from "components/driver/DriverSpeedStatisticsChart";
import DriverWeeklyTrip from "components/driver/DriverWeeklyTrip";
import DriverFuelConsumption from "components/driver/DriverFuelConsumption";
import DriverUtilizationStatistics from "components/driver/DriverUtilizationStatistics";
import DriverBehavior from "components/driver/DriverBehavior";
import { useTranslation } from "next-i18next";

const Driver = ({ driverId }) => {
  const [driverInfo, setDriverInfo] = useState({});
  const [driverInfoLoading, setDriverInfoLoading] = useState(true);
  const [overSpeedStatistics, setOverSpeedStatistics] = useState([]);
  const [overSpeedStatisticsLoading, setOverSpeedStatisticsLoading] =
    useState(true);
  const [weeklyTripsAndFuel, setWeeklyTripsAndFuel] = useState([]);
  const [weeklyTripsAndFuelLoading, setWeeklyTripsAndFuelLoading] =
    useState(true);

  const [utzStatisticsAndBehavior, setUtzStatisticsAndBehavior] = useState({});
  const [utzStatisticsAndBehaviorLoading, setUtzStatisticsAndBehaviorLoading] =
    useState(true);
  const { t } = useTranslation("driver");

  useEffect(() => {
    // fetch driver info(driver dashboard)
    const fetchDriverInfo = async () => {
      try {
        const respond = await fetchDriverData(driverId);
        setDriverInfo(respond.driver[0]);
        setDriverInfoLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setDriverInfoLoading(false);
      }
    };
    fetchDriverInfo();

    // fetch Over Speed Statistics Chart
    const fetchOverSpeedStatisticsChart = async () => {
      try {
        const respond = await fetchOverSpeedStatistics(driverId);
        setOverSpeedStatistics(respond.overSpeed);
        setOverSpeedStatisticsLoading(false);
      } catch (error) {
        setOverSpeedStatisticsLoading(false);
        toast.error(error.response.data?.message);
      }
    };
    fetchOverSpeedStatisticsChart();

    // fetch Weekly trips and fuel consumption
    const fetchWeeklyTripsAndFuelChart = async () => {
      try {
        const respond = await fetchWeeklyTripsAndFuel(driverId);
        setWeeklyTripsAndFuel(respond);
        setWeeklyTripsAndFuelLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setWeeklyTripsAndFuelLoading(false);
      }
    };
    fetchWeeklyTripsAndFuelChart();

    // fetch utilization statistics and driver behavior
    const fetchUtzStatisticsAndBehaviorChart = async () => {
      try {
        const respond = await fetchUtzStatisticsAndBehavior(driverId);
        setUtzStatisticsAndBehavior(respond);
        setUtzStatisticsAndBehaviorLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setUtzStatisticsAndBehaviorLoading(false);
      }
    };
    fetchUtzStatisticsAndBehaviorChart();
  }, [driverId]);

  const cardsData = [
    {
      title: t("status_key"),
      value: t("vehicle_disabled_key"),
      icon: faCheckCircle,
      color: "danger",
    },
    {
      title: t("driver_working_hours_key"),
      value: t("never_connected_hours_key"),
      icon: faUserClock,
      color: "info",
    },
    {
      title: t("distance_key"),
      value: t("never_connected_KM_key"),
      icon: faRoute,
      color: "warning",
    },
  ];

  return (
    <div className="m-3">
      <Row>
        <Col md={12} className={"mb-0"}>
          <Card>
            <Card.Body>
              <Row>
                {cardsData?.map(({ title, value, icon, color }, idx) => {
                  return (
                    <Col key={idx} md="4">
                      <Card className={`bg-soft-${color} my-1`}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-start">
                              <h5 className="counter">{title}</h5>
                              {value}
                            </div>
                            <div
                              className={`bg-soft-${color} rounded p-3 text-center`}
                            >
                              <FontAwesomeIcon
                                className=""
                                icon={icon}
                                size="2x"
                              />
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md="8">
          <DriverInfo data={driverInfo} loading={driverInfoLoading} />
        </Col>

        <Col md="4">
          <DriverBehavior
            data={utzStatisticsAndBehavior.behavior}
            loading={utzStatisticsAndBehaviorLoading}
          />
        </Col>
        <Col md="4">
          <DriverUtilizationStatistics
            data={utzStatisticsAndBehavior?.utilization}
            loading={utzStatisticsAndBehaviorLoading}
          />
        </Col>
        <Col md="8">
          <DriverWeeklyTrip
            data={weeklyTripsAndFuel.getSteps}
            loading={weeklyTripsAndFuelLoading}
          />
        </Col>
        <Col md="6">
          <DriverFuelConsumption
            data={weeklyTripsAndFuel.fuels}
            loading={weeklyTripsAndFuelLoading}
          />
        </Col>
        <Col md="6">
          <DriverSpeedStatisticsChart
            data={overSpeedStatistics}
            loading={overSpeedStatisticsLoading}
          />
        </Col>

        <Col md="6">
          <Card className="shadow-sm border border-light">
            <Card.Body className="">
              <h4 className="text-secondary text-center mb-3">
                {t("trips_heat_map_key")}
              </h4>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10258.249557165655!2d46.79713737942497!3d24.629236352222847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f09a01b058e93%3A0xcf8c3d13d259be3b!2z2LTYp9mE2YrZhyB2aXA!5e0!3m2!1sar!2seg!4v1666777560782!5m2!1sar!2seg"
                width="600"
                height="450"
                allowfullscreen=""
                loading="lazy"
                className="w-100"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6">
          <Card className="shadow-sm border border-light">
            <Card.Body className="">
              <h4 className="text-secondary text-center mb-3">
                {t("most_visited_places_key")}
              </h4>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10258.249557165655!2d46.79713737942497!3d24.629236352222847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f09a01b058e93%3A0xcf8c3d13d259be3b!2z2LTYp9mE2YrZhyB2aXA!5e0!3m2!1sar!2seg!4v1666777560782!5m2!1sar!2seg"
                width="600"
                height="450"
                allowfullscreen=""
                loading="lazy"
                className="w-100"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Driver;

// translation ##################################
export async function getServerSideProps({ locale, query }) {
  const { driverId } = query;
  return {
    props: {
      ...(await serverSideTranslations(locale, ["driver", "main"])),
      driverId,
    },
  };
}
// translation ##################################
