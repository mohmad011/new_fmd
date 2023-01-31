import axios from "axios";

// fetch device type for react select (add/add-device)
export const fetchDeviceTypes = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/devices/unassignedDevices`,
  });
  return response.data;
};

// fecth all unassigned sim cards data(add vehicle/add-sim)
export const fetchAllUnAssignedSimCardData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/sim/unassigned`,
  });
  return response.data;
};

// add new device
export const aadDeviceRequest = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/management/devices",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// add new Sim
export const addSimRequest = async (data) => {
  const response = await axios({
    method: "put",
    url: "dashboard/vehicles/addSimToVehicle",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};