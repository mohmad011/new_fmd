import axios from "axios";

// fetch all drivers data(main page)
export const fetchAllDrivers = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/drivers`,
  });
  return response.data;
};

// delete driver (main page)
export const deleteDriver = async (deleteSelected) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/drivers/${deleteSelected}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// fetch Unassigned Vehicles data (add driver / show vehicles)
export const fitchUnassignedVehicles = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/info/unassigned`,
  });
  return response.data;
};

// add new driver(add driver)
export const addDriver = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/drivers",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// add vehicle to driver(add driver / show vehicles)
export const addVehicleToDriver = async (DriverID, VehicleID) => {
  const response = await axios({
    method: "post",
    url: "dashboard/drivers/vehicle/assign",
    data: JSON.stringify({
      DriverID,
      VehicleID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// get driver data to edit (edit driver)
export const getDriverDataToEdit = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/drivers/${id}`,
  });
  return response.data;
};

// update driver data after edit (edit driver)
export const updateDriver = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `dashboard/drivers/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// fetch assigned vehicles to driver(show vehicles)
export const getDriverAssignedVehicles = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/drivers/vehicles/${id}`,
  });
  return response.data;
};

// unassign vehicle from driver (show vehicles)
export const UnAssignVehicle = async (DriverID, VehicleID) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/drivers/vehicle/unassign`,
    data: JSON.stringify({
      DriverID,
      VehicleID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};