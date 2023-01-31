import { createSlice } from "@reduxjs/toolkit";

// import { groupBykey, CalcVstatus, fbtolocInfo } from "../../helpers/streamHelper";

import UseStreamHelper from "../../helpers/streamHelper";

export const StreamData = createSlice({
  name: "StreamData",
  initialState: {
    VehFullData: [],
    VehTreeData: [],
    VehTotal: {},
    VehMap: [],
    // VehTree: [],
    status: {},
  },
  reducers: {
    addFullVehData: (state, { payload }) => {
      const { CalcVstatus } = UseStreamHelper();
      const FullVehData = payload?.map((l) => {
        return { ...l, VehicleStatus: CalcVstatus(l) };
      });
      state.VehFullData = [...FullVehData];
    },
    addVehTreeData: (state, { payload }) => {
      const { CalcVstatus } = UseStreamHelper();
      const FullTreeVehData = payload?.map((l) => {
        return { ...l, VehicleStatus: CalcVstatus(l) };
      });
      state.VehTreeData = [...FullTreeVehData];
    },
    countVehTotal: (state) => {
      const { groupBykey } = UseStreamHelper();
      const statusGroups = groupBykey(state.VehFullData, "VehicleStatus");
      const totalDrivers =
        state.VehFullData.filter((v) => v["DriverID"])?.length ?? 0;
      state.VehTotal = {
        totalVehs: state.VehFullData.length,
        activeVehs:
          state.VehFullData.length -
          (statusGroups[5]?.length || 0 + statusGroups[600]?.length || 0),
        offlineVehs:
          (statusGroups[5]?.length || 0) + (statusGroups[600]?.length || 0), //
        idlingVehs: statusGroups[2]?.length ?? 0, //
        RunningVehs: statusGroups[1]?.length ?? 0, //
        stoppedVehs: statusGroups[0]?.length ?? 0, //
        ospeedVehs: statusGroups[101]?.length ?? 0, //
        osspeedVehs: statusGroups[100]?.length ?? 0, //
        invalidVehs: statusGroups[203]?.length ?? 0, //
        totalDrivers: totalDrivers,
        activeDrivers:
          totalDrivers -
          (statusGroups[5]?.filter((v) => v["DriverID"])?.length ?? 0),
      };
    },
    // UpdateStatus: (state, action) => {
    //   if (action.payload?.SerialNumber) {
    //     if (state.VehFullData[action.payload?.SerialNumber].VehicleStatus !== action.payload?.VehicleStatus) {
    //       state.status[action.payload?.SerialNumber] = action.payload?.VehicleStatus;
    //       state.VehFullData[action.payload?.SerialNumber] = action.payload;
    //     }
    //     localStorage.setItem(encryptName("vehicles_status"), JSON.stringify(state.status));
    //   }
    // },
    UpdateVehicle: (state, { payload }) => {
      if (payload?.isPatched) {
        state.VehFullData = state.VehFullData?.map((old) => {
          return (
            payload.patch.find(
              (ele) => ele.SerialNumber === old.SerialNumber
            ) ?? old
          );
        });
      } else {
        state.VehFullData[
          state.VehFullData.findIndex(
            (x) => x?.SerialNumber == payload?.patch?.SerialNumber
          )
        ] = payload.patch;
      }
    },
    UpdateTree: (state, { payload }) => {
      if (payload?.isPatched) {
        state.VehTreeData = state.VehTreeData?.map((old) => {
          return (
            payload.patch.find(
              (ele) => ele.SerialNumber === old.SerialNumber
            ) ?? old
          );
        });
      } else {
        if (payload?.patch?.SerialNumber) {
          const old_veh =
            state.VehTreeData[
              state.VehTreeData.find(
                (x) => x.SerialNumber == payload?.patch?.SerialNumber
              )
            ];
          if (
            old_veh?.VehicleStatus !== payload?.patch?.VehicleStatus ||
            old_veh?.Speed !== payload?.patch?.Speed ||
            old_veh?.Mileage !== payload?.patch?.Mileage ||
            old_veh?.WeightVolt !== payload?.patch?.WeightVolt ||
            old_veh?.Direction !== payload?.patch?.Direction ||
            old_veh?.Temp1 !== payload?.patch?.Temp1 ||
            old_veh?.Hum1 !== payload?.patch?.Hum1
          ) {
            state.VehTreeData[
              state.VehTreeData.findIndex(
                (x) => x?.SerialNumber == payload?.patch?.SerialNumber
              )
            ] = payload.patch;
          }
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addFullVehData,
  addVehTreeData,
  countVehTotal,
  updateFbLocInfo,
  filterVehFullData,
  // UpdateStatus,
  UpdateVehicle,
  UpdateTree,
} = StreamData.actions;

export default StreamData.reducer;
