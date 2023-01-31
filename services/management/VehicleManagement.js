import axios from "axios";

// fecth Vehilces Statistics(main page)
export const fetchVehilceStatistics = async () => {
  const response = await axios({
    method: "get",
    url: `/dashboard/vehicles/statistics`,
  });
  return response.data;
};

// fecth all vehicles(main page)
export const fetchAllVehicles = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles`,
  });
  return response.data;
};

// fecth all unassigned Vehicles(main page)
export const fetchAllUnAssignedVehicles = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/info/nodevice`,
  });
  return response.data;
};

// fecth all selections data(add vehicle/vehicleData)
export const fetchAllSelectionsData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/modelsTypes`,
  });
  return response.data;
};

// fecth all selections data(add vehicle/add-device)
export const fetchAllUnAssignedDevicesData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/unAssignedDevices`,
  });
  return response.data;
};

// fecth all selections data(add vehicle/add-sim)
export const fetchAllUnAssignedSimCardData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/unAssignedSims/sims`,
  });
  return response.data;
};

// fecth all selections data(add vehicle/add-group)
export const fetchVehicleGroups = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/groups`,
  });
  return response.data;
};

// add new vehicle(add vehicle)
export const addVehicleRequst = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/vehicles",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// add new Device
export const addDeviceRequst = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/vehicles/assignDevice",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// add new Sim
export const addSimRequst = async (data) => {
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

// fetch vehicle data (edit vehicle)
export const editVehicle = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/${id}`,
  });
  return response.data;
};

// update vehicle data (edit vehicle)
export const updateVehicle = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `dashboard/vehicles/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// delete vehicle data (main page)
export const deleteVehicle = async (deleteSelected) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/vehicles/${deleteSelected}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Add Vehicles Bulk data (main page)
export const postVehiclesBulk  = async (data) => {
  const response = await axios({
    method: 'post',
    url: `dashboard/vehicles/addVehicleBulk`,
    data: data,
    headers: {
      'Content-Type': "multipart/form-data",
    },
  })
  return response.data;
}