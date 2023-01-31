import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-toastify";
import Btn from "./Btn";
import { useTranslation } from "next-i18next";

const Btns = ({
  geofencesViewToggle,
  geofencesToggle,
  clusterToggle,
  setGeofencesToggle,
  Styles,
  show,
  setGeofencesViewToggle,
  L,
  setGeofences,
  geofences,
  myMap,

  setLandMarksToggle,
  landMarkstoggle,

  landMarks,
  setLandMarks,
  setclusterToggle,

  locateToggle,
  setLocateToggle,
}) => {
  const { t } = useTranslation("main");

  const DrawShape = useCallback((item) => {
    console.log("item", item);
    switch (item.GeoFenceType) {
      case 1: // Polygon
        L.polygon(item.GeofencePath, { color: "red" }).addTo(
          myMap.groups.drawGroup
        );
        break;

      case 2: // Circle
        L.circle(item.GeofencePath, {
          color: "red",
          radius: +item.GeofenceRadius,
        }).addTo(myMap.groups.drawGroup);
        break;

      case 3: // Rectangle
        L.rectangle(item.GeofencePath, { color: "red" }).addTo(
          myMap.groups.drawGroup
        );
        break;
    }
  }, []);

  const handleViewGeofences = async () => {
    setGeofencesViewToggle(!geofencesViewToggle);
    if (!geofencesViewToggle) {
      if (geofences.length > 0) {
        console.log("geofences", geofences);
        await geofences?.map((item) => DrawShape(item));
      } else {
        try {
          toast.warning("please wait...");
          const response = await axios.get(
            `geofences/dev`);

          if (response.status === 200) {
            let handledData = response.data?.allGeoFences?.map(
              (item) => item.handledData
            );
            console.log("handledData", handledData);
            await handledData?.map((item) => {
              // check if a circle
              if (item.GeoFenceType === 2) {
                let GeofencePath = [];
                item.GeofencePath?.map((item) => {
                  item?.map((item) => GeofencePath.push(+item));
                });
                item.GeofencePath = GeofencePath;
              } else {
                item.GeofencePath = item.GeofencePath?.map((item) =>
                  item?.map((item) => +item)
                );
              }
            });

            await handledData?.map((item) => DrawShape(item));

            setGeofences(handledData);
          }

          response.data?.allGeoFences.length === 0 &&
            toast.warning(t("There_is_no_GeoFences_Right_Now!"));
        } catch (error) {
          toast.error(error?.message);
        }
      }
    } else {
      myMap.groups.drawGroup.clearLayers();
    }
  };

  const handleLandMarks = async () => {
    setLandMarksToggle(!landMarkstoggle);
    if (!landMarkstoggle) {
      if (landMarks.length > 0) {
        landMarks?.map((landmark) => {
          L?.marker(L.latLng(landmark.Latitude, landmark.Longitude), {
            icon: new L.divIcon({
              html: `<img alt='mu' src='assets/images/landmarks/Home.png' />`,
              className: "landMarksIcons",
              iconSize: L.point(7, 7),
            }),
          }).addTo(myMap);
        });
      } else {
        const response = await axios.get(`landmarks`);
        if (response.status === 200) {
          const results = response?.data?.marks;

          results?.map((landmark) => {
            L?.marker(L.latLng(landmark.Latitude, landmark.Longitude), {
              icon: new L.divIcon({
                html: `<img alt='mu' src='assets/images/landmarks/Home.png' />`,
                className: "landMarksIcons",
                iconSize: L.point(7, 7),
              }),
            }).addTo(myMap);
          });
          setLandMarks(results);
        } else {
          toast.error(response?.data?.error?.message);
        }
      }
    } else {
      document.querySelectorAll(".landMarksIcons").forEach((el) => {
        el.style.display = "none";
      });
    }
  };

  const handleCluster = () => {
    myMap.setCluster(clusterToggle);
    setclusterToggle(!clusterToggle);
  };

  const handleShowGeofences = () => setGeofencesToggle((prev) => !prev);

  const handleLocate = () => {
    setLocateToggle(!locateToggle);
    var lat, lng;
    let getLatLngsOnHoverMap = (ev) => {
      // myMap.getLatLngsOnHoverMap();
      lat = ev?.latlng?.lat;
      lng = ev?.latlng?.lng;
      console.log("lat, lng", lat, lng);
    };
    // if (!locateToggle) {
    //   myMap.addEventListener("mousemove", getLatLngsOnHoverMap);
    // } else {
    //   myMap.removeEventListener("mousemove", getLatLngsOnHoverMap, false);
    // }

    function onMoveEnd(evt) {
      myMap.addEventListener("mousemove", getLatLngsOnHoverMap(evt));
    }

    myMap.on("movestart", onMoveEnd);
  };

  return (
    <div className={`${Styles.list} ${show && Styles.active}`}>
      <Btn
        text={t("Locate")}
        btnToggle={locateToggle}
        handleClick={handleLocate}
        Styles={Styles}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1"
          viewBox="0 0 256 256"
        >
          <path
            d="M1113 2545c-324-59-602-284-722-586-52-131-65-200-65-354 0-114 4-156 23-225 79-296 276-635 576-995 87-104 346-385 355-385s268 281 355 385c300 360 497 699 576 995 30 110 33 327 6 434-93 374-379 650-752 727-104 22-246 23-352 4zm282-480c172-45 305-179 350-352 65-249-94-511-350-578-251-65-513 94-580 350-89 343 237 669 580 580z"
            transform="matrix(.1 0 0 -.1 0 256)"
          ></path>
        </svg>
      </Btn>

      <Btn
        text={t("View_Geofences")}
        btnToggle={geofencesViewToggle}
        handleClick={handleViewGeofences}
        Styles={Styles}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1"
          viewBox="0 0 256 256"
        >
          <path
            d="M1113 2545c-324-59-602-284-722-586-52-131-65-200-65-354 0-114 4-156 23-225 79-296 276-635 576-995 87-104 346-385 355-385s268 281 355 385c300 360 497 699 576 995 30 110 33 327 6 434-93 374-379 650-752 727-104 22-246 23-352 4zm282-480c172-45 305-179 350-352 65-249-94-511-350-578-251-65-513 94-580 350-89 343 237 669 580 580z"
            transform="matrix(.1 0 0 -.1 0 256)"
          ></path>
        </svg>
      </Btn>

      <Btn
        text={t("Geofences")}
        btnToggle={geofencesToggle}
        handleClick={handleShowGeofences}
        Styles={Styles}
      >
        <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 64 64">
          <path
            d="M82 537c-16-17-22-36-22-70 0-26-4-47-10-47-5 0-10-9-10-20s5-20 10-20c6 0 10-33 10-80s-4-80-10-80c-5 0-10-9-10-20s5-20 10-20c6 0 10-20 10-45V90h100v45c0 38 3 45 20 45s20-7 20-45V90h100v45c0 38 3 45 20 45s20-7 20-45V90h100v45c0 38 3 45 20 45s20-7 20-45V90h100v45c0 25 5 45 10 45 6 0 10 9 10 20s-4 20-10 20-10 33-10 80 4 80 10 80 10 9 10 20-4 20-10 20c-5 0-10 22-10 48 0 39-5 53-25 72l-25 23-25-23c-20-19-25-33-25-72 0-41-3-48-20-48s-20 7-20 48c0 39-5 53-25 72l-25 23-25-23c-20-19-25-33-25-72 0-41-3-48-20-48s-20 7-20 48c0 39-5 53-25 72l-25 23-25-23c-20-19-25-33-25-72 0-41-3-48-20-48s-20 7-20 48c0 38-5 53-23 70-29 27-29 27-55-1zm118-237c0-73-2-80-20-80s-20 7-20 80 2 80 20 80 20-7 20-80zm140 0c0-73-2-80-20-80s-20 7-20 80 2 80 20 80 20-7 20-80zm140 0c0-73-2-80-20-80s-20 7-20 80 2 80 20 80 20-7 20-80z"
            transform="matrix(.1 0 0 -.1 0 64)"
          ></path>
        </svg>
      </Btn>

      <Btn
        text={t("Show_Landmarks")}
        btnToggle={landMarkstoggle}
        handleClick={handleLandMarks}
        Styles={Styles}
      >
        <svg
          width="26px"
          height="26px"
          viewBox="0 -32 576 576"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs
            style={{
              fill: clusterToggle ? "#fbfbfb !important" : "#246c66 !important",
            }}
          ></defs>
          <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z" />
        </svg>
      </Btn>

      <Btn
        text={t("Enable_Disable_Clusters")}
        btnToggle={clusterToggle}
        handleClick={handleCluster}
        Styles={Styles}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 546.9 571.02">
          <defs
            style={{
              fill: clusterToggle ? "#fbfbfb !important" : "#246c66 !important",
            }}
          ></defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <path
                className="cls-1"
                d="m221.07 389.56-52.39 90.73 52.39 90.73h104.76l52.39-90.73-52.39-90.73H221.07zM389.75 292.17l-52.38 90.73 52.38 90.73h104.77l52.38-90.73-52.38-90.73H389.75zM389.75 278.85h104.77l52.38-90.73-52.38-90.73H389.75l-52.38 90.73 52.38 90.73zM325.83 181.46l52.39-90.73L325.83 0H221.07l-52.39 90.73 52.39 90.73h104.76zM157.15 278.85l52.39-90.73-52.39-90.73H52.38L0 188.12l52.38 90.73h104.77zM157.15 292.17H52.38L0 382.9l52.38 90.73h104.77l52.39-90.73-52.39-90.73zM221.07 194.78l-52.39 90.73 52.39 90.73h104.76l52.39-90.73-52.39-90.73H221.07z"
              />
            </g>
          </g>
        </svg>
      </Btn>
    </div>
  );
};

export default Btns;
