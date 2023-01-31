import axios from "axios";
import { utc } from "moment";
import * as _ from "lodash";
import config from "config/config";

// import _ from "lodash";
// import match from "autosuggest-highlight/match";
// import parse from "autosuggest-highlight/parse";

export const locDataModel = {
  Duration: 0,
  WeightReading: "-",
  Address: null,
  RecordDateTime: "2020-01-01T00:00:01", //"2020-01-01T00:00:01", //L.Saferoad.Vehicle.Helpers.Date2KSA(new Date(2020,01,01)),
  Latitude: 0,
  Longitude: 0,
  Direction: 0,
  Speed: 0,
  EngineStatus: -1,
  IgnitionStatus: -1,
  VehicleStatus: -1,
  Mileage: 0,
  Temp: 0,
  HUM: 0,
  DoorStatus: "-",
  IsValidRecord: "-",
  RemainingFuel: "-",
  StoppedTime: "-",
  StreetSpeed: "-",
  WeightVolt: -1,
  EngineTotalRunTime: -1,
  RPM: -1,
  AccelPedalPosition: -1,
  MileageMeter: -1,
  TotalMileage: -1,
  FuelLevelPer: -1,
  InstantFuelConsum: -1,
  TotalFuelConsum: -1,
  CoolantTemp: -1,
};

export const locConfigModel = {
  AccountID: null,
  VehicleID: null,
  SerialNumber: null,
  Serial: null,
  WorkingHours: -1,
  HeadWeight: 0,
  TailWeight: 0,
  TotalWeight: 0,
  MinVoltage: 0,
  MaxVoltage: 0,
  HasSensor: 0,
  Duration: 0,
  WeightReading: -1,
  Address: null,
  RecordDateTime: "2020-01-01T00:00:01",
  Latitude: 0,
  Longitude: 0,
  Direction: 0,
  Speed: 0,
  EngineStatus: -1,
  IgnitionStatus: -1,
  VehicleStatus: 5,
  Mileage: 0,
  DoorStatus: "-",
  IsValidRecord: "-",
  RemainingFuel: "-",
  StoppedTime: "-",
  StreetSpeed: "-",
  WeightVolt: -1,
  EngineTotalRunTime: -1,
  RPM: -1,
  AccelPedalPosition: -1,
  MileageMeter: -1,
  TotalMileage: -1,
  FuelLevelPer: -1,
  InstantFuelConsum: -1,
  TotalFuelConsum: -1,
  CoolantTemp: -1,
  Battery1: -1,
  Battery2: -1,
  Battery3: -1,
  Battery4: -1,
  Hum1: -1,
  Hum2: -1,
  Hum3: -1,
  Hum4: -1,
  Temp1: 3000,
  Temp2: 3000,
  Temp3: 3000,
  Temp4: 3000,
};

export const Date2KSA = (_date, _zone = 3) =>
  utc(_date ?? new Date(0))
    .utcOffset(_zone * 60)
    .format("LL hh:mm:ss a");

export const Date2UTC = (_date) =>
  new Date(
    _date.indexOf("Date") < 0
      ? _date + "+0000"
      : utc(_date ?? new Date(0)).format("YYYY-MM-DDTHH:mm:ss") + "-0300"
  );

export const isDateExpired = (_locInfo) => {
  // console.log(_locInfo?.RecordDateTime);
  const locDate =
    _locInfo?.RecordDateTime ??
    Date2KSA(new Date(new Date().getFullYear(), 0, 1));
  const ksaNow = Date2KSA(utc(new Date()).format("YYYY-MM-DDTHH:mm:ss"));
  let age = (new Date(ksaNow) - new Date(locDate)) / 36e5;
  return (_locInfo?.EngineStatus !== 0 && age > 0.5) || age > 4;
};

export const GetStatusString = (vehicleStatus) => {
  switch (vehicleStatus) {
    case 600:
    case 5:
      return "Offline.";
    case 101:
      return "Vehicle is Over Speeding.";
    case 100:
      return "Vehicle is running over street speed.";
    case 0:
      return "Vehicle is Stopped.";
    case 1:
      return "Vehicle is running normally.";
    case 2:
      return "Vehicle in Idle State.";
    default:
      return "Invalid Status";
  }
};

export const isValidAddress = (_address) =>
  !(
    _address == null ||
    _address == "Address not found" ||
    _address.includes("(")
  );

export const getAddress = async (
  locinfo
) => {
  const { data } = await axios.get(
    `http://api.positionstack.com/v1/reverse?access_key=a903324f990648dededca77d8749fcef&limit=1&query=${locinfo.Latitude},${locinfo.Longitude}`
  );
  console.log(data[0]["label"]);
  //var getJson = $.getJSON("/Map/GetAddressFromAPI?Coord=" + pubLocInfo.Latitude + ',' + pubLocInfo.Longitude + "&Lang=" + $('body').attr('data-lang'));
  // var getJson = Object.assign(locinfo, {
  //   Address: data[0].label,
  //   RecordDateTime: locinfo.RecordDateTime,
  //   Longitude: locinfo.Longitude,
  //   Latitude: locinfo.Latitude,
  // });
};

export const WeightVoltToKG = (_locInfo, _settings) => {
  if (_locInfo.WeightVolt < 0) return _settings.WeightReading;
  if (
    _locInfo.WeightVolt < _settings.MinVoltage ||
    _settings.MinVoltage == _settings.MaxVoltage
  )
    return "Not Available";

  let weight =
    _settings.MaxVoltage == _settings.MinVoltage
      ? 0
      : ((_locInfo.WeightVolt - _settings.MinVoltage) * _settings.TotalWeight) /
      (_settings.MaxVoltage - _settings.MinVoltage);
  weight += _settings.HeadWeight;
  return weight.toFixed(1);
};

export const iconUrl = (VehicleStatus) => {
  let iconUrl = "/assets/images/cars/";

  switch (VehicleStatus) {
    case 0:
    case 1:
    case 2:
    case 100:
    case 101:
      iconUrl += VehicleStatus + ".png";
      // console.log("VehicleStatus: " + VehicleStatus);
      // return <Car2 />;
      break;
    case 600:
    case 5:
      iconUrl += "5.png";
      // console.log("VehicleStatus: " + VehicleStatus);
      // return <Car4 />;
      break;
    default:
      // console.log("VehicleStatus: " + VehicleStatus);
      // return <Car7 />;

      iconUrl += "201.png";
  }
  return iconUrl;
};

export const getKey = (state) => {
  // 1 : Running
  // 0 : Stopped
  // 2 : Idling
  // 5 : Offline
  // 101 : Over Speed
  // 100 : Over Street Speed
  // 203 : Invalid location
  switch (state) {
    case 0:
      return "stopped";
    case 1:
      return "running";
    case 2:
      return "idling";
    case 5:
    case 600:
      return "offline";
    case 100:
      return "over_street_speed";
    case 101:
      return "over_speed";
    case 203:
    default:
      return "invalid_location";
  }
};

export const filterByNames = (t, data, inputValue) => {
  // Create a dynamic regex expression object with ignore case sensitivity
  const re = new RegExp(_.escapeRegExp(inputValue), "i");
  // clone the original data deeply
  // as we need to modify the array while iterating it
  const clonedData = _.cloneDeep(data);
  const results = clonedData.filter((object) => {
    // use filter instead of some
    // to make sure all items are checked
    // first check object.list and then check object.name
    // to avoid skipping list iteration when name matches
    return (
      object.subTitle.filter((item) => {
        if (re.test(t(item.name))) {
          item["highlight"] = true;
          return t(item.name);
        } else {
          return false;
        }
      }).length > 0 || re.test(t(object.name))
    );
  });
  // console.log("results in helpers", results);
  return results;
};

export const filterBySerialNumber = (data, inputValue) => {
  const re = new RegExp(_.escapeRegExp(inputValue), "i");
  const clonedData1 = _.cloneDeep(data);
  const clonedDataAlt1 = clonedData1[0].children;

  const results = clonedDataAlt1?.filter((object) => {
    return (
      object?.children?.filter((item) => {
        if (
          re.test(item.SerialNumber) &&
          item.SerialNumber.startsWith(inputValue)
        ) {
          // const matches = match(item.SerialNumber, inputValue);
          // item["subTitle"] = parse(item.SerialNumber, matches);
          // if (item.SerialNumber.startsWith(inputValue)) {
          // }

          item["highlight"] = true;
          // console.log("item in filterBySerialNumber", item, re.test(item));
          return item.SerialNumber;
        } else {
          return;
        }
      }).length > 0 || re.test(object.SerialNumber)
    );
  });
  // clonedData1.children = results;
  // const results1 = clonedData?.map((itemUp) => itemUp.children)
  // console.log("clonedData1 in helpers", clonedData1);
  return results;
};

export const filterByAnyWordsTrak = (data, inputValue, nameKey) => {
  // const re = new RegExp(_.escapeRegExp(inputValue), "i");
  const clonedData1 = _.cloneDeep(data);
  const clonedDataAlt1 = clonedData1[0].children;

  // console.log("clonedDataAlt1", clonedDataAlt1);

  // nameKey
  // SerialNumber

  // let EnteredNameKey = nameKey || "SerialNumber";

  console.log("inputValue , nameKey", inputValue, nameKey);

  const results = clonedDataAlt1?.filter((object) => {
    return (
      object?.children?.filter((item) => {
        if (nameKey === "Address") {
          let itemStr = String(item[nameKey]);
          console.log(
            "is equal Address",
            item,
            itemStr,
            item[nameKey]
            //   typeof item[nameKey],
            //   treeFilterFrom,
            //   treeFilterTo,
            //   inputValue
          );
          if (itemStr.toLocaleLowerCase().includes(inputValue)) {
            item["highlight"] = true;

            return itemStr;
          } else {
            return;
          }
        } else if (nameKey === "Speed") {
          const { treeFilterFrom, treeFilterTo } = inputValue;
          // console.log("inputValue is Speed", inputValue);
          if (
            (treeFilterFrom === 0 && treeFilterTo >= 0) ||
            (!isNaN(treeFilterFrom) && !isNaN(treeFilterTo))
          ) {
            // console.log(
            //   "is equal Speed",
            //   item,
            //   item[nameKey],
            //   typeof item[nameKey],
            //   treeFilterFrom,
            //   treeFilterTo,
            //   inputValue
            // );
            if (
              item[nameKey] > treeFilterFrom &&
              item[nameKey] <= treeFilterTo
            ) {
              item["highlight"] = true;

              return item[nameKey];
            } else {
              return;
            }
          }
        } else {
          let itemStr = String(item[nameKey]);
          // console.log("is Not equal", item);
          if (itemStr.toLocaleLowerCase().startsWith(inputValue)) {
            item["highlight"] = true;
            console.log(
              item
              //   item[nameKey],
              //   typeof item[nameKey],
              //   treeFilterFrom,
              //   treeFilterTo,
              //   inputValue
            );
            return itemStr;
          } else {
            return;
          }
        }
      }).length > 0
    );
  });

  // || re.test(object[nameKey])

  // clonedData1.children = results;
  // const results1 = clonedData?.map((itemUp) => itemUp.children)
  console.log("results in helpers", results);
  return results;
};

export const fetchAllDrivers = async (token, setLoading, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`${config.apiGateway.URL}dashboard/drivers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          const result = response.data;
          setData_table(result?.drivers);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const fetchAllMaintenance = async (token, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`${config.apiGateway.URL}dashboard/management/maintenance`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then(({ data }) => {
      setData_table(data?.result);
    })
    .catch((err) => console.log(err));
};

export const fetchAllGeofence = async (token, setData_table) => {
  // let myToken = token.toString();
  await axios
    .get(`${config.apiGateway.URL}geofences/dev`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      setData_table(data?.allGeoFences?.map((item) => item.handledData));
    })
    .catch((err) => console.log(err));
};

export const handleGroups = (groups) => {
  // if (groups) {
  //   var all = { all: groups };
  // }

  if (groups["Default"]) {
    groups["Default"] = [...groups["Default"]];
    groups["Un Group"] = groups["null"] && [...groups["null"]];
  } else if (groups["null"]) {
    groups["ungroup"] = [...groups["null"]];
  }
  delete groups["null"];
  let result = [];
  result.push({
    title: "All",
    children: [groups],
  });
  for (let key in result[0]?.children[0]) {
    if (result[0]?.children[0]?.hasOwnProperty(key))
      result[0]?.children?.push({
        title: key,
        children: result[0]?.children[0][key],
      });
  }

  result[0].children.splice(0, 1);
  return result;
};

export const handleCheckKey = (keys, key) =>
  Object.keys(keys).some((element) => element == key);

export const handleFilterVehs = (statusVeh, streamData) => {
  let flterData;

  if (statusVeh.active === 2) {
    flterData = streamData.VehFullData.filter(
      (item) => item.VehicleStatus !== 5
    );
  } else if (statusVeh.stopped === 1) {
    flterData = streamData.VehFullData.filter(
      (item) => item.VehicleStatus === 5
    );
  } else {
    flterData = streamData.VehFullData;
  }

  return flterData;
};

// export const fetchAllAccounts = async (token, setLoading, setData_table) => {
//   let myToken = token.toString();
//   await axios
//     .get(`${config.apiGateway.URL}dashboard/management/accounts`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${myToken}`,
//       },
//     })
//     .then((response) => {
//       setLoading(true);
//       setTimeout(() => {
//         if (response.status === 200) {
//           setLoading(false);
//           // console.log("response.status", response.status);
//           const result = response.data;
//           setData_table(result?.result);
//         }
//       }, 1000);
//     })
//     .catch((err) => console.log(err));
// };

export const fetchData = async (token, setLoading, setData_table, api) => {
  let myToken = token.toString();
  setLoading(true);
  await axios
    .get(api, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        // console.log("response.status", response.status);
        const result = response.data;
        setData_table(result?.result);
      }
    })
    .finally(() => {
      setLoading(false);
    })
    .catch((err) => console.log(err));
};

export const postData = async (
  token,
  data,
  toast,
  setLoading,
  // path,
  api
) => {
  let myToken = token.toString();
  setLoading(true);
  await axios
    .post(api, data, {
      // method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((res) => {
      console.log("res.status , data", res.status, data);
      if (res.status === 201) {
        toast.success("Driver Add Successfully.");
        console.log("res.status , data", res.status, data);
        return "add";
      }
    })
    .catch((error) => {
      toast.error(`Error: ${error?.message}`);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const fetchAllSimCards = async (token, setLoading, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`${config.apiGateway.URL}dashboard/management/sim?provider=4`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          // console.log("response.status", response.status);
          const result = response.data;
          setData_table(result?.result);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const fetchAllUnassignedSimCards = async (
  token,
  setLoading,
  setData_table
) => {
  let myToken = token.toString();
  await axios
    .get(`${config.apiGateway.URL}dashboard/management/sim/unassigned`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          // console.log("response.status", response.status);
          const result = response.data;
          setData_table(result?.result);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const updateDriver = (setOpenUpdate, setDriverID, id) => {
  setOpenUpdate(true);
  setDriverID(id);
};
