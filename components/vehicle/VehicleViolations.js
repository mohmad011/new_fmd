import React from "react";
import { Card, Col } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const VehicleViolations = () => {
  const { t } = useTranslation(["vehicle"]);

  const chart = {
    options: {
      chart: {
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      colors: ["#246c66", "#4bc7d2"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "28%",
          endingShape: "rounded",
          borderRadius: 5,
        },
      },
      legend: {
        show: false,
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
        categories: [
          "2021-10-04",
          "2021-10-03",
          "2021-10-02",
          "2021-10-01",
          "2021-09-30",
        ],
        labels: {
          minHeight: 20,
          maxHeight: 20,
          style: {
            colors: "#8A92A6",
          },
        },
      },
      yaxis: {
        title: {
          text: "",
        },
        labels: {
          minWidth: 19,
          maxWidth: 19,
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
            return " " + val;
          },
        },
      },
    },
    series: [
      {
        name: "violations_key",
        data: [30, 50, 35, 60, 40],
      },
    ],
  };

  return (
    <Col md="6" lg="3">
      <Card
        style={{
          height: "calc(100% - 2rem)",
        }}
      >
        <Card.Body className="pb-0 text-start" style={{ direction: "ltr" }}>
          <h4>{t("violations_key")}</h4>
          <Chart
            className="d-activity"
            options={chart.options}
            series={chart.series}
            type="bar"
            height="260"
          />
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VehicleViolations;
