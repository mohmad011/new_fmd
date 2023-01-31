import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Saferoad } from "components/maps/leafletchild";
import { useDispatch, useSelector } from "react-redux";
import { setMap } from "lib/slices/mainMap";

const Map = ({ myMap, minHeight = "60vh" }) => {
  const L = require("leaflet");
  const dispatch = useDispatch();
  const VehFullData = useSelector((state) => state.streamData.VehFullData);

  useEffect(() => {
    try {
      myMap.off();
      myMap.remove();
    } catch (e) {
      console.log("not map");
    }

    dispatch(
      setMap(
        Saferoad?.map("MyMap", {
          popupSettings: { newvar: true, dontShowPopUp: false },
        })
          .setZoom(7)
          .setView(L.latLng(24.629778, 46.799308))
      )
    );
  }, [L]);
  // to pin the data in the map
  useEffect(() => {
    if (VehFullData.length !== 0) {
      VehFullData?.map((x) => {
        myMap && myMap.pin(x, false);
      });
    }
  }, [myMap, VehFullData]);
  return (
    <>
      <div style={{ width: "100%", minHeight: minHeight }} id="MyMap"></div>
    </>
  );
};

export default Map;
