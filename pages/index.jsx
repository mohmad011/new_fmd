import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLoadScript } from "@react-google-maps/api";

const Google = dynamic(() => import("components/dashboard/google"), {
  ssr: false,
});

import Progress from "components/dashboard/Progress/index";

// services functions
import {
  fetchPreventiveChartData,
  fetchTopWorstData,
  fetchAverageUtilizationChart,
  fetchSpeedChartData,
} from "services/dashboard";

// Chart Component
import VehiclesStatusChart from "components/dashboard/Charts/VehiclesStatusChart";
import AverageUtilizationChart from "components/dashboard/Charts/AverageUtilizationChart";
import AverageSpeedAndDistanceChart from "components/dashboard/Charts/AverageSpeedAndDistanceChart";
import OverallPreventiveMaintenance from "components/dashboard/Charts/OverallPreventiveMaintenance";

// import NextrepairplansTable
import NextrepairplansTable from "components/dashboard/NextrepairplansTable";

// import CardsForRates
import CardsForRates from "components/dashboard/CardsForRates";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useStreamDataState from "hooks/useStreamDataState";
import dynamic from "next/dynamic";

const Home = () => {
  const [topWorstData, setTopWorstData] = useState(null);
  const [speedChartData, setSpeedChartData] = useState([]);
  const [preventiveChartData, setPreventiveChartData] = useState([]);
  const [averageUtilizationChart, setAverageUtilizationChart] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [loadingPreventiveChart, setLoadingPreventiveChart] = useState(true);
  const [loadingAvgSpeedChart, setLoadingAvgSpeedChart] = useState(true);
  const [loadingUtilization, setLoadingUtilization] = useState(true);
  const [loadingTopWorstData, setLoadingTopWorstData] = useState(true);

  const {
    streamData: { VehTotal },
  } = useSelector((state) => state);
  const { myMap } = useSelector((state) => state.mainMap);

  const { darkMode } = useSelector((state) => state.config);

  // progress count up wait till loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(VehTotal).length > 0) {
        setLoadingProgress(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [VehTotal]);

  useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const { indexStreamLoader } = useStreamDataState();

  useEffect(() => {
    indexStreamLoader();
  }, []);

  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html")[0];
    darkMode
      ? htmlTag.setAttribute("darkMode", true)
      : htmlTag.setAttribute("darkMode", false);
  }, [darkMode]);

  // helper func to get data from localstorage
  const getLocalstorage = (dataName, setData, setLoading) => {
    if (localStorage.getItem("allData")) {
      let allData = JSON.parse(localStorage.getItem("allData"));
      if (allData[dataName]) {
        const localstorageData = allData[dataName];
        setData(localstorageData);
        setLoading(false);
      }
    }
  };

  // helper func to set data in localstorage
  const setLocalstorage = (dataName, data) => {
    const allData = JSON.parse(localStorage.getItem("allData"));
    localStorage.setItem(
      "allData",
      JSON.stringify({ ...allData, [dataName]: data })
    );
  };

  useEffect(() => {
    // fetch Overall Preventive Maintenance chart data
    const fetchPreventiveData = async () => {
      getLocalstorage(
        "preventive-data",
        setPreventiveChartData,
        setLoadingPreventiveChart
      );
      try {
        const respond = await fetchPreventiveChartData();
        setPreventiveChartData(respond);
        setLoadingPreventiveChart(false);
        setLocalstorage("preventive-data", respond);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPreventiveChart(false);
      }
    };
    fetchPreventiveData();

    // top and low rated drivers
    const fetchTopWorst = async () => {
      getLocalstorage(
        "top-worst-data",
        setTopWorstData,
        setLoadingTopWorstData
      );
      try {
        const respond = await fetchTopWorstData();
        setTopWorstData(respond);
        setLoadingTopWorstData(false);
        setLocalstorage("top-worst-data", respond);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingTopWorstData(false);
      }
    };
    fetchTopWorst();

    // fetch Average Utilization chart data
    const fetchAvgUtilizationChart = async () => {
      getLocalstorage(
        "avg-utilization-data",
        setAverageUtilizationChart,
        setLoadingUtilization
      );
      try {
        const respond = await fetchAverageUtilizationChart();
        setAverageUtilizationChart(respond.avgUtlizations);
        setLoadingUtilization(false);
        setLocalstorage("avg-utilization-data", respond.avgUtlizations);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingUtilization(false);
      }
    };
    fetchAvgUtilizationChart();

    // fetch Overall average speed chart data
    const fetchSpeedChart = async () => {
      getLocalstorage(
        "speed-chart-data",
        setSpeedChartData,
        setLoadingAvgSpeedChart
      );
      try {
        const respond = await fetchSpeedChartData();
        setSpeedChartData(respond.fuelConsumptions);
        setLoadingAvgSpeedChart(false);
        setLocalstorage("speed-chart-data", respond.fuelConsumptions);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingAvgSpeedChart(false);
      }
    };
    fetchSpeedChart();
  }, []);

  return (
    <div className="m-3">
      <Row>
        {/* ############################  progress bars + Map  ############################################## */}
        <Col lg="6">
          <Row>
            <Progress loading={loadingProgress} VehTotal={VehTotal} />
          </Row>
        </Col>
        {/* map */}
        <Col lg="6">
          <Card className="shadow-sm border border-light" style={{ height: "calc(100% - 2rem)", overflow: "hidden" }}>
            <Card.Body className="p-0 position-relative">
              {/* <Google /> */}
              <Google minHeight={'100%'} myMap={myMap} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* ############################  Charts  ############################################## */}
      <Row>
        {/* charts part one */}
        <VehiclesStatusChart VehTotal={VehTotal} />
        {/* charts part two */}
        <AverageUtilizationChart
          data={averageUtilizationChart}
          loading={loadingUtilization}
        />
      </Row>
      <Row>
        {/* chart part three */}
        <AverageSpeedAndDistanceChart
          data={speedChartData}
          loading={loadingAvgSpeedChart}
        />

        {/* chart part four */}
        <OverallPreventiveMaintenance
          data={preventiveChartData?.allMaintenance}
          loading={loadingPreventiveChart}
        />
      </Row>

      {/* ############################ cards for rates  ############################################## */}
      <Row>
        <CardsForRates data={topWorstData} loading={loadingTopWorstData} />
      </Row>
      {/* ############################ table  ############################################## */}
      <Row>
        <NextrepairplansTable
          data={preventiveChartData?.Upcoming_Maintenance_Plans}
        />
      </Row>
    </div>
  );
};

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ["main", "dashboard"])),
    },
  };
}
export default Home;

// translation ##################################
