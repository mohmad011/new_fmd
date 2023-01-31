import "react-leaflet-draw";
import { useRouter } from "next/router";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { useState } from "react";
import dynamic from "next/dynamic";
import Styles from "styles/MenuBottom.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import Btns from "./Btns";
const AddModal = dynamic(() => import("./AddModal"), {
  ssr: false,
});

import AddGeofence from "./AddGeofence";
import EditModal from "./EditModal";

import { useSelector } from "react-redux";

const MenuBottom = () => {
  const L = require("leaflet");
  const [show, setShow] = useState(false);
  const { locale } = useRouter();

  const [clusterToggle, setclusterToggle] = useState(false);
  const [landMarkstoggle, setLandMarksToggle] = useState(false);
  const [geofencesViewToggle, setGeofencesViewToggle] = useState(false);
  const [geofencesToggle, setGeofencesToggle] = useState(false);
  const [locateToggle, setLocateToggle] = useState(false);

  const [landMarks, setLandMarks] = useState([]);
  const [geofences, setGeofences] = useState([]);

  const [validated, setValidated] = useState(false);
  const [addGeofence, setAddGeofence] = useState(false);
  const [editGeofence, setEditGeofence] = useState(false);
  const [Data_table, setData_table] = useState([]);

  const [ID, setID] = useState(0);

  const { myMap } = useSelector((state) => state.mainMap);

  const handleCloseGeofences = () => {
    setGeofencesToggle(false);
  };

  return (
    <>
      <div
        className={`${Styles.menu_bottom_main} d-flex position-absolute`}
        style={{
          zIndex: geofencesToggle || addGeofence || editGeofence ? 1003 : 1000,
        }}
      >
        <button
          type="button"
          className={`${Styles.show_btn} ${
            show && Styles.active
          } border-0 mx-1 p-2`}
          onClick={() => setShow((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <Btns
          geofencesViewToggle={geofencesViewToggle}
          geofencesToggle={geofencesToggle}
          landMarkstoggle={landMarkstoggle}
          clusterToggle={clusterToggle}
          landMarks={landMarks}
          setLandMarks={setLandMarks}
          setGeofencesToggle={setGeofencesToggle}
          setclusterToggle={setclusterToggle}
          Styles={Styles}
          show={show}
          setGeofencesViewToggle={setGeofencesViewToggle}
          L={L}
          setGeofences={setGeofences}
          geofences={geofences}
          myMap={myMap}
          setLandMarksToggle={setLandMarksToggle}
          locateToggle={locateToggle}
          setLocateToggle={setLocateToggle}
        />

        {addGeofence && (
          <div
            className={`position-fixed ${Styles.AddGeofence} ${Styles.trans}`}
            style={{
              left: locale === "ar" ? "20px" : "auto",
              right: locale === "ar" ? "auto" : "20px",
            }}
          >
            <AddModal
              validated={validated}
              setValidated={setValidated}
              setAddGeofence={setAddGeofence}
              setGeofencesToggle={setGeofencesToggle}
              addGeofence={addGeofence}
              L={L}
              setData_table={setData_table}
              setGeofences={setGeofences}
              myMap={myMap}
            />
          </div>
        )}

        {editGeofence && (
          <div
            className={`position-fixed ${Styles.AddGeofence} ${Styles.trans}`}
            style={{
              left: locale === "ar" ? "20px" : "auto",
              right: locale === "ar" ? "auto" : "20px",
            }}
          >
            <EditModal
              validated={validated}
              setValidated={setValidated}
              setAddGeofence={setAddGeofence}
              setGeofencesToggle={setGeofencesToggle}
              ID={ID}
              L={L}
              setData_table={setData_table}
              Data_table={Data_table}
              editGeofence={editGeofence}
              setEditGeofence={setEditGeofence}
              myMap={myMap}
              setGeofencesViewToggle={setGeofencesViewToggle}
            />
          </div>
        )}

        <div
          className={`position-fixed ${Styles.AddGeofence} ${
            geofencesToggle ? Styles.show : Styles.hide
          } ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <AddGeofence
            setAddGeofence={setAddGeofence}
            setGeofencesToggle={setGeofencesToggle}
            editGeofence={editGeofence}
            setEditGeofence={setEditGeofence}
            handleCloseGeofences={handleCloseGeofences}
            Data_table={Data_table}
            setData_table={setData_table}
            setID={setID}
            geofencesToggle={geofencesToggle}
            geofences={geofences}
            map={myMap}
            L={L}
            setGeofencesViewToggle={setGeofencesViewToggle}
            setGeofences={setGeofences}
          />
        </div>
      </div>
    </>
  );
};

export default MenuBottom;
