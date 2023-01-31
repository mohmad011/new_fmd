import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

import configUrls from "config/config";

import { locConfigModel, Date2KSA } from "helpers/helpers";
import StreamHelper from "helpers/streamHelper";

import {
  addFullVehData,
  addVehTreeData,
  countVehTotal,
  UpdateTree,
  UpdateVehicle,
} from "lib/slices/StreamData";
import { encryptName } from "helpers/encryptions";
import { useSession } from "next-auth/client";

function useStreamDataState() {
  // useDispatch to update the global state
  const dispatch = useDispatch();
  const [session] = useSession();
  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };

  let fbSubscribers = [];
  const { myMap } = useSelector((state) => state.mainMap);

  let updatePatchSet = null;
  // get global state
  const VehFullData = useSelector((state) => state.streamData.VehFullData);

  // update Global state
  const apiLoadVehSettings = async (withLoc = true) => {
    const response = await axios.get(
      `vehicles/settings?withloc=${withLoc ? 1 : 0}`
    );

    if (response.status === 200 && response.data?.length > 0) {
      let result = response.data.filter((v) => v.SerialNumber !== null);
      result = result?.map((x) => {
        var config = Object.assign({}, locConfigModel);
        Object.assign(config, x);
        config.MinVoltage = locConfigModel.MinVolt;
        config.MaxVoltage = locConfigModel.MaxVolt;
        config.RecordDateTime = Date2KSA(config.RecordDateTime);
        return Object.assign(x, config);
      });
      return result;
    }

    return [];
  };
  // SerialNumber
  const UpdateAction = (locInfo, args) => {
    let patchObj = {};
    if (args?.patchTimeSec > 0) {
      updatePatchSet = updatePatchSet ?? { StartAt: new Date(), Data: {} };
      updatePatchSet.Data[locInfo?.SerialNumber] = locInfo;
      patchObj = {
        patch: Object.values(updatePatchSet.Data),
        isPatched: true,
      };
    }
    const now = new Date();
    const patchSinceSec =
      (now.getTime() - (updatePatchSet?.StartAt ?? now)?.getTime()) / 1000;
    if (patchSinceSec >= args?.patchTimeSec) {
      dispatch(UpdateVehicle(patchObj));
      dispatch(UpdateTree(patchObj));
      dispatch(countVehTotal());
      patchObj?.patch?.forEach((v) => {
        myMap && myMap?.UpdateMarker(v);
      });
      updatePatchSet = null;
    }
  };

  const FbSubscribe = async (vehicles, onlyOnce = false) => {
    const patchTimeSec =
      vehicles.length > 3000
        ? 16
        : vehicles.length > 2000
          ? 12
          : vehicles.length > 1000
            ? 8
            : vehicles.length > 100
              ? 4
              : 0;
    const { fbtolocInfo } = StreamHelper();
    const subid = fbSubscribers.push({ cancel: false }) - 1;
    const App = initializeApp(firebaseConfig, "updatefb");

    const db = getDatabase(App);
    var ids = vehicles?.map((i) => i?.SerialNumber);
    await ids.forEach((id) => {
      onValue(
        ref(db, id),
        (snapshot) => {
          if (!snapshot.hasChildren()) return;
          if (fbSubscribers[subid].cancel) return;
          const { locInfo, updated } = fbtolocInfo(snapshot, vehicles);
          if (updated) {
            const args = { patchTimeSec };
            UpdateAction(locInfo, args);
          }
          snapshot.exists();
        },
        (error) => {
          console.error("error : ", error);
        },
        { onlyOnce: onlyOnce }
      );
    });
  };

  const apiGetVehicles = async (localExpireMin = 30) => {
    let vehState = [];
    let vehStorage = {};
    let updatedResult = [];
    let updated = false;

    // filling available data
    vehState = [...VehFullData];
    // check if data exists not expired
    if (vehState.length == 0) {
      const userData = JSON.parse(
        localStorage.getItem(encryptName("userData")) ?? "{}"
      );
      // console.log("userData", userData);
      vehStorage =
        userData["userId"] != session?.user?.user?.id ? {} : userData;
      // console.log("vehStorage", vehStorage);
      const isStorageExpired =
        (new Date(vehStorage?.updateTime) ?? new Date(0)) <
        new Date(
          new Date().setMinutes(new Date().getMinutes() - localExpireMin)
        );
      if (
        JSON.stringify(vehStorage?.vehData ?? {}) == "{}" ||
        isStorageExpired
      ) {
        updatedResult = await apiLoadVehSettings(true); //load full data
        updated = updatedResult.length > 0;
      } else {
        updatedResult = vehStorage.vehData;
      }
      dispatch(addFullVehData([...updatedResult]));
      dispatch(addVehTreeData([...updatedResult]));
    } else {
      updatedResult = vehState;
    }

    if (updated) {
      localStorage.setItem(
        encryptName("userData"),
        JSON.stringify({
          userId: session?.user?.user?.id,
          updateTime: new Date(),
          vehData: updatedResult,
        })
      );
    }

    return { updated, updatedResult, vehStorage };
  };

  const trackStreamLoader = async () => {
    const { checkNewOfflines } = StreamHelper();
    const { updatedResult } = await apiGetVehicles(30);
    await dispatch(countVehTotal());

    setTimeout(async () => {
      await FbSubscribe(updatedResult);
    }, 5000);

    setInterval(() => {
      const newOfflines = checkNewOfflines(VehFullData);
      if (newOfflines.length) {
        newOfflines.forEach((x) => UpdateAction(x));
      }
    }, 60 * 1000);
  };

  const indexStreamLoader = async () => {
    const { updatedResult } = await apiGetVehicles(30);
    await FbSubscribe(updatedResult, true);
    await dispatch(countVehTotal());

    const fbTimer = setInterval(() => {
      if (window.location.pathname != "/") clearInterval(fbTimer);
      else FbSubscribe(updatedResult, true);
    }, 50 * 60 * 1000);
  };

  return {
    trackStreamLoader,
    indexStreamLoader,
  };
}

export default useStreamDataState;
