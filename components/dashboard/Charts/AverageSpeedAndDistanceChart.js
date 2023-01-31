import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import React from "react";
import { Col } from "react-bootstrap";
import Styles from "styles/Dashboard.module.scss";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AverageSpeedAndDistanceChart({ data, loading }) {
  const yAxisSpeed = data?.map((ele) => ele?.avgSpeed.toFixed(2));
  const yAxisDistance = data?.map((ele) => ele?.avgDistance.toFixed(2));
  const xAxis = data?.map((ele) =>
    new Date(`${ele._id}`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );

  const { t } = useTranslation("dashboard");

  const chart = {
    series: [
      {
        name: t("average_speed_key"),
        type: "column",
        data: yAxisSpeed,
      },
      {
        name: t("average_distance_key"),
        type: "line",
        data: yAxisDistance,
      },
    ],
    options: {
      chart: {
        fontFamily: "Cairo, sans-serif",
        height: 350,
        type: "line",
        style: {
          fontSize: ".5rem",
          fontWeight: "bold",
        },
        toolbar: {
          show: true,
        },
        sparkline: {
          enabled: false,
        },
      },
      stroke: {
        width: [0, 2],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
        style: {
          fontSize: ".55rem",
        },
      },
      labels: xAxis,
      colors: ["#246c66", "#3e84b8"],
      yaxis: [
        {
          title: {
            text: t("average_speed_key"),
          },
          labels: {
            show: true,
            minWidth: 10,
            maxWidth: 10,
            style: {
              colors: "#8A92A6",
            },
            offsetX: 0,
          },
        },
        {
          opposite: true,
          title: {
            text: t("average_distance_key"),
          },
        },
      ],
    },
  };
  return (
    <>
      <Col lg="6">
        <div className="card">
          <div className="card-header d-flex justify-content-between flex-wrap">
            <div className="header-title">
              <h4 className={"card-title " + Styles.head_title}>
                {t("average_speed_and_distance_key")}
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
                type="line"
                height="245"
              />
            ) : (
              <EmptyMess msg={`${t("oops!_no_data_found_key")}.`}  />
            )}
          </div>
        </div>
      </Col>
    </>
  );
}
