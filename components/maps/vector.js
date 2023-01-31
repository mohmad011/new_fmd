import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Saferoad } from "./leafletchild";
import { useDispatch } from "react-redux";
import { setMap } from "lib/slices/mainMap";
import { useLoadScript } from "@react-google-maps/api";

const Map = ({ myMap, height = "91vh" }) => {
  const L = require("leaflet");
  const dispatch = useDispatch();
  useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
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
          popupSettings: { dontShowPopUp: true },
        })
          .setZoom(7)
          .setView(L.latLng(24.629778, 46.799308))
      )
    );
  }, [L]);

  return (
    <>
      {/* <div style={{ width: "100%", minHeight: "91vh" }} ref={map}></div> */}
      <div style={{ width: "100%", minHeight: height }} id="MyMap"></div>
    </>
  );
};

export default Map;
