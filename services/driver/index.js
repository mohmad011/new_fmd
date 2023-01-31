import axios from "axios";

// fetch driver info(driver dashboard)
export const fetchDriverData = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/drivers/${id}`,
  });
  return response.data;
};

// fetch Over Speed Statistics(driver dashboard)
export const fetchOverSpeedStatistics = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/driver/overspeed/${id}`,
  });
  return response.data;
};

// fetch Weekly trips and fuel consumption(driver dashboard)
export const fetchWeeklyTripsAndFuel = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/driver/trips/${id}`,
  });
  return response.data;
};

// fetch utilization statistics and driver behavior(driver dashboard)
export const fetchUtzStatisticsAndBehavior = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/driver/utilization/${id}`,
  });
  return response.data;
};