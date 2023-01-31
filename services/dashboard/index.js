import axios from "axios";

// fetch Overall Preventive Maintenance chart data  (main page)
export const fetchPreventiveChartData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/mainDashboard/home`,
  });
  return response.data;
};

// top and low rated drivers (main page)
export const fetchTopWorstData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/mainDashboard/topWorst`,
  });
  return response.data;
};

// fetch Average Utilization chart data (main page)
export const fetchAverageUtilizationChart = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/mainDashboard/avgUtlization`,
  });
  return response.data;
};

// fetch Overall average speed chart data (main page)
export const fetchSpeedChartData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/mainDashboard/fuel`,
  });
  return response.data;
};