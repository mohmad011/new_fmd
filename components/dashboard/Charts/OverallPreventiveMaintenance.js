import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import React from "react";
import { Col } from "react-bootstrap";
import Styles from "styles/Dashboard.module.scss";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OverallPreventiveMaintenance({ data, loading }) {
  const xAxis = data?.map((ele) => ele?.MaintenancePlan);
  const yAxis = data?.map((ele) => ele?.numOfMaintenance);
  const { t } = useTranslation("dashboard");

  const chart = {
    series: [
      {
        name: t("number_of_vehicles_key"),
        data: yAxis,
      },
    ],
    options: {
      chart: {
        fontFamily: "Cairo, sans-serif",

        height: 245,
        type: "bar",
        
        toolbar: {
          show: true,
        },
        sparkline: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "28%",
          endingShape: "rounded",
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },

      xaxis: {
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            fontSize: ".6rem",
            fontWeight: "bold",
          },
        },
        categories: xAxis,
        tickPlacement: "on",
      },
      yaxis: {
        title: {
          text: t("number_of_vehicles_key"),
        },
      },
      fill: {
        colors: ["#246c66"],
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: ["#4bc7d2"],
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    },
  };
  return (
    <>
      <Col lg="6">
        <div className="card">
          <div className="card-header d-flex justify-content-between flex-wrap">
            <div className="header-title">
              <h4 className={"card-title " + Styles.head_title}>
                {t("overall_preventive_maintenance_key")}
              </h4>
            </div>
          </div>
          <div style={{ direction: "ltr" }} className="card-body">
            {loading ? (
              <Spinner />
            ) : data.length ? (
              <Chart
                options={chart.options}
                series={chart.series}
                type="bar"
                height="245"
              />
            ) : (
              <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
            )}
          </div>
        </div>
      </Col>
    </>
  );
}
