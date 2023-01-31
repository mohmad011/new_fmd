import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import React from "react";
import { Col } from "react-bootstrap";
import Styles from "styles/Dashboard.module.scss";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AverageUtilizationChart({ data, loading }) {
  const yAxis = data?.map((ele) => ele?.avgUtlization.toFixed(2));
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
        name: t("average_utilization_key"),
        data: yAxis,
      },
    ],
    options: {
      type: "bar",
      chart: {
        fontFamily: "Cairo , sans-serif",
        toolbar: {
          show: true,
        },
      },
      colors: ["#246c66"],
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
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: xAxis,
        labels: {
          style: {
            colors: "#8A92A6",
            fontSize: ".7rem",
            fontWeight: "bold",
          },
        },
      },
      yaxis: {
        title: {
          text: t("average_utilization_key"),
        },
        labels: {
          style: {
            colors: "#8A92A6",
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return ` ${val}`;
          },
        },
      },
    },
  };
  return (
    <>
      <Col md="12" xl="6">
        <div className="card" style={{ height: "calc(100% - 2rem)" }}>
          <div className="card-header d-flex justify-content-between flex-wrap">
            <div className="header-title">
              <h4 className={"card-title " + Styles.head_title}>
                {t("average_utilization_key")}
              </h4>
            </div>
          </div>
          <div style={{ direction: "ltr" }} className="card-body">
            {loading ? (
              <Spinner />
            ) : data.length ? (
              <Chart
                className="d-activity"
                options={chart.options}
                series={chart.series}
                type="bar"
                height="300"
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
