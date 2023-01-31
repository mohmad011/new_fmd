import { useMemo, useEffect } from "react";
import { useTranslation } from "next-i18next";

const UseTableColumns = (recordDate2, recordDate3) => {
  const { t } = useTranslation("Table");
  const handleFullName = (params) => {
    return `${params.data.FirstName}-${params.data.LastName}`;
  };

  const handlePeriod = (params) => {
    let strData = params.data.StrDate?.split("T")[0];
    let endData = params.data.EndDate?.split("T")[0];

    return `${strData} To: ${endData}`;
  };

  // let handlePeriodColumns14;

  // useEffect(() => {
  //   if (recordDate2 && recordDate3) {
  //     handlePeriodColumns14 = () => {
  //       return `${recordDate2?.split("T")[0]} To: ${
  //         recordDate3?.split("T")[0]
  //       }`;
  //     };
  //   }
  // }, [recordDate2, recordDate3]);

  function isFloat(n) {
    return n % 1 !== 0;
  }

  const handleToRoundNum = (data) => Math.round(data);

  const handleToFixed = (data) => (isFloat(data) ? data.toFixed(2) : data);

  const handleToLocaleString = (data) => data.toLocaleString();

  const handleToFixedDistance = (params) =>
    handleToFixed(+params.data.Distance);

  const handleToFixedFuleL = (params) => handleToRoundNum(+params.data.fule_L);
  const handleToFixedFuel_SR = (params) =>
    handleToRoundNum(+params.data.fuel_SR);

  const handleToFixedAvgWeight = (params) => {
    let AvgWeight = isFloat(+params.data.AvgWeight)
      ? +params.data.AvgWeight.toFixed(2)
      : +params.data.AvgWeight;
    return AvgWeight.toLocaleString();
  };

  const handleMin_weight = (params) =>
    handleToLocaleString(+params.data.Min_weight);

  const handleMax_weight = (params) =>
    handleToLocaleString(+params.data.Max_weight);

  const handleZoneTime = (data) => {
    let history = data?.split("T")[0];
    let dateFull = data?.split("T")[1];
    let dateNow = dateFull?.split(".")[0];
    let morNight = dateNow?.split(":")[0] <= 12 ? "AM" : "PM";
    return `${history} ${dateNow} ${morNight}`;
  };

  const handleExitTime = (params) => handleZoneTime(params.data.RecodDateTime);

  const handleEnterTime = (params) =>
    handleZoneTime(params.data.geo1RecordDateTime);

  const handleZone_In_Time = (params) =>
    handleZoneTime(params.data.geo1RecordDateTime);
  const handleRecordDateTime = (params) =>
    handleZoneTime(params.data.recorddatetime);

  const handleinZone_Duration = (params) => `0d:${params.data.inZone_Duration}`;

  const handleDAT_Score = (params) => `${params.data.DAT_Score}%`;

  const handleCalcUserVehiclesOfflineDays = (params) => {
    let days = Math.floor(
      (new Date(Date.now()) - new Date(params.data.LastUpdateTime)) /
        1000 /
        60 /
        60 /
        24
    );
    return days > 0 ? days : 0;
  };

  const handleDuringPeriod = (params) => `From ${params.data.DuringPeriod}`;

  const handleGroupName = (params) => {
    if (params.data.Group_Name) {
      return params.data.Group_Name === null
        ? "Ungrouped"
        : params.data.Group_Name;
    } else {
      return params.data.GroupName === null
        ? "Ungrouped"
        : params.data.GroupName;
    }
  };

  const handleOfflineDays = (params) => {
    let days = Math.floor(
      (new Date(Date.now()) - new Date(params.data.LastUpdateTime)) /
        1000 /
        60 /
        60 /
        24
    );
    return days;
  };

  const columns1 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "StrDate",
        valueGetter: handlePeriod,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("W.Hours")}`,
        field: "W_Hours",
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("F.Cost_SR")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Driver")}`,
        field: "FirstName",
        valueGetter: handleFullName,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const columns2 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "StrDate",
        valueGetter: handlePeriod,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("W.Hours")}`,
        field: "W_Hours",
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("F.Cost_SR")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Driver")}`,
        field: "FirstName",
        valueGetter: handleFullName,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const columns3 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "StrDate",
        valueGetter: handlePeriod,
      },
      {
        headerName: `${t("Start_Date")}`,
        field: "StrDate",
      },
      {
        headerName: `${t("End_Date")}`,
        field: "EndDate",
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("W.Hours")}`,
        field: "W_Hours",
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("F.Cost_SR")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const columns4 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Start_Time")}`,
        field: "StrDate",
      },
      {
        headerName: `${t("End_Time")}`,
        field: "EndDate",
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("Fuel_Cost")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",
      },
      {
        headerName: `${t("AVG_Speed")}`,
        field: "AVGSpeed",
      },
      {
        headerName: `${t("Start_Address")}`,
        field: "StrAdd",
      },
      {
        headerName: `${t("End_Address")}`,
        field: "EndAdd",
      },
    ],
    [t]
  );

  const columns5 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "StrDate",
        valueGetter: handlePeriod,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("Fuel_Cost")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const columns6 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "StrDate",
        valueGetter: handlePeriod,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("Fule-L")}`,
        field: "fule_L",
        valueGetter: handleToFixedFuleL,
      },
      {
        headerName: `${t("Fuel_Cost")}`,
        field: "fuel_SR",
        valueGetter: handleToFixedFuel_SR,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const columns7 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Period")}`,
        field: "StrDate",
        valueGetter: handlePeriod,
      },
      {
        headerName: `${t("Distance")}`,
        field: "Distance",
        valueGetter: handleToFixedDistance,
      },
      {
        headerName: `${t("W.Hours")}`,
        field: "W_Hours",
      },
      {
        headerName: `${t("Rapid_Acceleration")}`,
        field: "RapidAccel",
      },
      {
        headerName: `${t("Harsh_Braking_count")}`,
        field: "HarshBraking",
      },
      {
        headerName: `${t("Overspeed")}`,
        field: "OverSpeed",
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",
      },
      {
        headerName: `${t("Driver")}`,
        field: "DriverName",
      },
      {
        headerName: `${t("DAT_Score")}`,
        field: "DAT_Score",
        valueGetter: handleDAT_Score,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const columns8 = useMemo(
    () => [
      {
        headerName: `${t("Group")}`,
        field: "Name",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Enter_Zone")}`,
        field: "GeoName",
      },
      {
        headerName: `${t("Enter_Time")}`,
        field: "geo1RecordDateTime",
        valueGetter: handleEnterTime,
      },
      {
        headerName: `${t("Exit_Zone")}`,
        field: "geo1GeoName",
      },
      {
        headerName: `${t("Exit_Time")}`,
        field: "RecodDateTime",
        valueGetter: handleExitTime,
        sortable: true,
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
    ],
    [t]
  );

  const columns9 = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Geo_Name")}`,
        field: "GeoName",
      },
      {
        headerName: `${t("Operation")}`,
        field: "Operation",
      },
      {
        headerName: `${t("Time")}`,
        field: "RecodDateTime",
      },
      {
        headerName: `${t("Coordinates")}`,
        field: "coordinates",
      },
      {
        headerName: `${t("Speed")}`,
        field: "Speed",
      },
    ],
    [t]
  );

  const columns10 = useMemo(
    () => [
      {
        headerName: `${t("Zone_Name")}`,
        field: "geo1geoname",
      },
      {
        headerName: `${t("Number_of_Vehicle")}`,
        field: "numberofVehicle",
      },
      {
        headerName: `${t("Trip_count")}`,
        field: "countTrips",
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
      {
        headerName: `${t("During_Period")}`,
        field: "DuringPeriod",
        valueGetter: handleDuringPeriod,
      },
    ],
    [t]
  );

  const columns11 = useMemo(
    () => [
      {
        headerName: `${t("Zone_Name")}`,
        field: "geo1geoname",
      },
      {
        headerName: `${t("Number_of_Vehicle")}`,
        field: "numberofVehicle",
      },
      {
        headerName: `${t("Trips_count")}`,
        field: "countTrips",
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
      {
        headerName: `${t("During_Period")}`,
        field: "DuringPeriod",
        valueGetter: handleDuringPeriod,
      },
    ],
    [t]
  );

  const columns12 = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "NAME",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "platenumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "displayname",
      },
      {
        headerName: `${t("Zone_Name")}`,
        field: "geo1GeoName",
      },
      {
        headerName: `${t("Zone_In_Time")}`,
        field: "geo1RecordDateTime",
        valueGetter: handleZone_In_Time,
      },
      {
        headerName: `${t("Zone_Out_time")}`,
        field: "recorddatetime",
        valueGetter: handleRecordDateTime,
      },
      {
        headerName: `${t("In_Zone_Duration")}`,
        field: "inZone_Duration",
        valueGetter: handleinZone_Duration,
      },
    ],
    [t]
  );

  const columns13 = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "name",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "platenumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "displayname",
      },
      {
        headerName: `${t("Zone_Name")}`,
        field: "geo1geoname",
      },
      {
        headerName: `${t("count_Trips")}`,
        field: "countTrips",
      },
      {
        headerName: `${t("In_Zone_Duration")}`,
        field: "TotalINTime",
      },
    ],
    [t]
  );

  const columns14 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Serial_Number")}`,
        field: "SerialNumber",
      },
      {
        headerName: `${t("Period")}`,
        field: "period",
      },
      {
        headerName: `${t("Min_weight")}`,
        field: "Min_weight",
        valueGetter: handleMin_weight,
      },
      {
        headerName: `${t("Max_weight")}`,
        field: "Max_weight",
        valueGetter: handleMax_weight,
      },
      {
        headerName: `${t("Avg_weight")}`,
        field: "AvgWeight",
        valueGetter: handleToFixedAvgWeight,
      },
      {
        headerName: `${t("Max_Speed")}`,
        field: "MaxSpeed",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
    ],
    [t]
  );

  const columns15 = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Serial_Number")}`,
        field: "SerialNumber",
      },
      {
        headerName: `${t("Record_Date_Time")}`,
        field: "RecordDateTime",
      },
      {
        headerName: `${t("weight")}`,
        field: "weight",
      },
      {
        headerName: `${t("Voltage_Reading")}`,
        field: "VoltageReading",
      },
      {
        headerName: `${t("Speed")}`,
        field: "Speed",
      },
      {
        headerName: `${t("Vehicle_Status")}`,
        field: "VehicleStatus",
      },
    ],
    [t]
  );

  const columns16 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Serial_Number")}`,
        field: "serialNumber",
      },
      {
        headerName: `${t("Period")}`,
        field: "StrDate",
        valueGetter: handlePeriod,
      },
      {
        headerName: `${t("Max_T1")}`,
        field: "MaxT1",
      },
      {
        headerName: `${t("Min_T1")}`,
        field: "MinT1",
      },
      {
        headerName: `${t("Max_T2")}`,
        field: "MaxT2",
      },
      {
        headerName: `${t("Min_T2")}`,
        field: "MinT2",
      },
      {
        headerName: `${t("Min_T3")}`,
        field: "MinT3",
      },
      {
        headerName: `${t("AVG_T3")}`,
        field: "AVG T3",
      },
      {
        headerName: `${t("Max_T3")}`,
        field: "MaxT3",
      },
    ],
    [t]
  );

  const columns17 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Serial_Number")}`,
        field: "serialNumber",
      },
      {
        headerName: `${t("Speed")}`,
        field: "Speed",
      },
      {
        headerName: `${t("Start_Time")}`,
        field: "RecordDateTime",
      },
      {
        headerName: `${t("End_Time")}`,
        field: "recorddatetime2",
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "groupname",
      },
    ],
    [t]
  );

  const columns18 = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Time")}`,
        field: "RecordDateTime",
      },
      {
        headerName: `${t("Speed_Limit")}`,
        field: "SpeedLimit",
      },
      {
        headerName: `${t("Over_Speed")}`,
        field: "Speed",
      },
      {
        headerName: `${t("Address")}`,
        field: "Address",
      },
    ],
    [t]
  );

  const columns19 = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Time")}`,
        field: "RecordDateTime",
      },
      {
        headerName: `${t("Speed_Limit")}`,
        field: "SpeedLimit",
      },
      {
        headerName: `${t("Over_Speed")}`,
        field: "Speed",
      },
      {
        headerName: `${t("Address")}`,
        field: "Address",
      },
    ],
    [t]
  );

  const columns20 = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "GroupName",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Serial_Number")}`,
        field: "SerialNumber",
      },
      {
        headerName: `${t("Last_Online_Date")}`,
        field: "LastUpdateTime",
      },
      {
        headerName: `${t("Last_Location")}`,
        field: "Address",
      },
      {
        headerName: `${t("Offline_(Days)")}`,
        field: "Address",
        valueGetter: handleOfflineDays,
      },
    ],
    [t]
  );

  const columns21 = useMemo(
    () => [
      {
        headerName: `${t("Group_Name")}`,
        field: "GroupName",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Serial_Number")}`,
        field: "SerialNumber",
      },
      {
        headerName: `${t("Last_Online_Date")}`,
        field: "LastUpdateTime",
      },
      {
        headerName: `${t("Last_Location")}`,
        field: "Address",
      },
      {
        headerName: `${t("Offline_(Days)")}`,
        field: "LastUpdateTime",
        valueGetter: handleCalcUserVehiclesOfflineDays,
      },
    ],
    [t]
  );

  const columns22 = useMemo(
    () => [
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "Group_Name",
        valueGetter: handleGroupName,
      },
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Status")}`,
        field: "StrEvent",
      },
      {
        headerName: `${t("Duration")}`,
        field: "Duration",
      },
      {
        headerName: `${t("Start_Time")}`,
        field: "StrDate",
      },
      {
        headerName: `${t("End_Time")}`,
        field: "EndDate",
      },
      {
        headerName: `${t("Start_Address")}`,
        field: "StrAdd",
      },
      {
        headerName: `${t("End_Address")}`,
        field: "EndAdd",
      },
    ],
    [t]
  );
  return {
    columns1,
    columns2,
    columns3,
    columns4,
    columns5,
    columns6,
    columns7,
    columns8,
    columns9,
    columns10,
    columns11,
    columns12,
    columns13,
    columns14,
    columns15,
    columns16,
    columns17,
    columns18,
    columns19,
    columns20,
    columns21,
    columns22,
  };
};

export default UseTableColumns;
