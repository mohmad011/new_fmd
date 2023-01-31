import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import config from "config/config";
import { CustomInput } from "../../CustomInput";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

const AddModal = ({
  validated,
  setAddGeofence,
  setGeofencesToggle,
  setValidated,
  addGeofence,
  L,
  setData_table,
  setGeofences,
  myMap,
}) => {
  const { t } = useTranslation("Table");
  const { darkMode } = useSelector((state) => state.config);
  const [Name, setName] = useState("");
  const [Speed, setSpeed] = useState("");
  const [Email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [speedMsg, setSpeedMsg] = useState("");

  let options = useMemo(() => {
    return {
      position: "topleft",
      collapsed: false,

      edit: {
        featureGroup: myMap.groups.drawGroup,
        edit: false,
        remove: false,
      },

      draw: {
        marker: false,
        polyline: false,
        circlemarker: false,

        rectangle: {
          shapeOptions: {
            color: "red",
          },
        },
        circle: {
          shapeOptions: {
            color: "red",
          },
        },
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: "red",
          },
        },
      },
    };
  }, []);

  let drawControl = new L.Control.Draw(options);

  const drawer = new L.Draw.Circle(myMap, drawControl.options.draw.circle);

  const postDrawLayer = async (layer, idx = 0) => {
    try {
      let drawObject = {
        GeofenceRadius: null,
        GeofenceName: Name + (idx ? idx : ""),
        Speed,
        Email,
      };

      let altPath;

      switch (layer.options.layerType) {
        case "polygon":
          drawObject = {
            ...drawObject,
            GeoFenceType: 1,
            GeofencePath: layer.getLatLngs()[0]?.map((x) => [x.lat, x.lng]),
          };

          altPath = layer.getLatLngs()[0]?.map((x) => [x.lat, x.lng]);
          break;
        case "circle":
          drawObject = {
            ...drawObject,
            GeoFenceType: 2,
            GeofencePath: [layer.getLatLng().lat, layer.getLatLng().lng],
            GeofenceRadius: layer.getRadius(),
          };

          altPath = [layer.getLatLng().lat, layer.getLatLng().lng];
          console.log("layer", layer);
          break;
        case "rectangle":
          var bounds = [
            layer.getBounds()._northEast,
            layer.getBounds()._southWest,
          ];

          altPath = [
            [bounds[0].lat, bounds[0].lng],
            [bounds[1].lat, bounds[1].lng],
          ];

          drawObject = {
            ...drawObject,
            GeoFenceType: 3,
            GeofencePath: [
              bounds[0].lat,
              bounds[0].lng,
              bounds[1].lat,
              bounds[1].lng,
            ],
          };
          break;
      }

      const resp = await axios.post(
        `geofences`,
        { ...drawObject },
        {
          headers: {
            "Content-Type": "application/json",
           
          },
        }
      );

      if (resp.status === 201) {
        toast.success("Geofence Added Successfully.");
        return {
          id: L.stamp(layer),
          drawObject: {
            ...drawObject,
            ID: resp.data.newGeoFence[0][0].ID,
            GeofencePath: altPath,
          },
        };
      } else {
        toast.error(`Error: Can Not Add Geofence `);
        return { id: 0 };
      }
    } catch (e) {
      console.log(" Error: " + e.message);
      toast.error(`Error: Can Not Add Geofence `);
    }
    return { id: 0 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const layers = myMap.groups.drawGroup.getLayers();
    if (layers.length == 0) {
      toast.error(`Please Draw Geofence on the map first..`);
      return;
    }

    const emailValidated = Email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (emailValidated === null) {
      toast.error(`Please Enter A Valid Email...`);
      return;
    }

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoading(true);

    let promises = [];
    layers.forEach((layer, idx) => {
      const promise = postDrawLayer(layer, idx);
      promises.push(promise);
    });
    (await Promise.all(promises)).forEach((resp) => {
      if (resp.id) {
        setGeofences((prev) => [...prev, resp.drawObject]);
        myMap.groups.drawGroup.removeLayer(resp.id);
        setData_table((prev) => [...prev, resp.drawObject]);
      }
    });

    if (myMap.groups.drawGroup.getLayers().length == 0) {
      setAddGeofence(false);
      setGeofencesToggle(true);
      setValidated(false);
    }
    setLoading(false);
  };

  const checkIfNumber = (e) => {
    return !/[0-9]/.test(e.key) ? true : false;
  };

  const handleSpeedOnKeyPress = (e) => {
    if (checkIfNumber(e)) {
      e.preventDefault();

      setSpeedMsg("Please Enter Number Only! ");
    } else {
      setSpeedMsg("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === "Name" && setName(value);
    name === "Speed" && setSpeed(value);
    name === "Email" && setEmail(value);
  };

  useEffect(() => {
    drawer.enable();
    return () => drawer.disable();
  }, [addGeofence]);

  useEffect(() => {
    if (addGeofence) {
      myMap.addControl(drawControl);
      myMap.on(L.Draw.Event.DRAWSTART, () => {
        myMap.groups.drawGroup.clearLayers();
        drawer.disable();
      });

      myMap.on(L.Draw.Event.CREATED, function (e) {
        drawer.disable();
        var layer = e.layer;
        layer.options["layerType"] = e.layerType;
        layer.addTo(myMap.groups.drawGroup);
        myMap.groups.drawGroup.addLayer(layer);
      });
    }

    return () => myMap.removeControl(drawControl);
  }, [addGeofence]);

  return (
    <div
      className={` p-3 rounded shadow `}
      style={{
        background: darkMode ? "#222738" : "#FFFFFF",
      }}
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <CustomInput
            ClassN="col-12 col-md-6 col-lg-4 mb-3"
            required={true}
            value={Name}
            handleChange={handleChange}
            Name="Name"
            Label={t("Geofence_Name")}
          />

          <Form.Group
            className="col-12 col-md-6 col-lg-4 mb-3"
            controlId={t("Geofence_Speed")}
          >
            <Form.Label>{t("Geofence_Speed")}</Form.Label>
            <Form.Control
              className="border-primary fw-bold"
              name="Speed"
              value={Speed}
              onChange={handleChange}
              type="number"
              placeholder={t("Geofence_Speed")}
              required={true}
              onKeyPress={handleSpeedOnKeyPress}
            />
            <Form.Control.Feedback type="invalid">
              {t("Geofence_Speed_is_required")}
            </Form.Control.Feedback>

            {speedMsg && <p className="text-danger">{speedMsg}</p>}
          </Form.Group>

          <CustomInput
            ClassN="col-12 col-md-6 col-lg-4 mb-3"
            required={true}
            value={Email}
            handleChange={handleChange}
            Name="Email"
            Label={t("Notify_Email")}
          />
        </Row>
        <div className="w-50">
          <Button
            variant="primary"
            className="w-25 mx-1 bg-primary px-2 py-1 d-inline-flex justify-content-center align-items-center"
            type="submit"
            disabled={loading}
          >
            {!loading ? (
              <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
            ) : (
              <FontAwesomeIcon
                className="mx-2 fa-spin"
                icon={faSpinner}
                size="sm"
              />
            )}
            <span>{t("Save")}</span>
          </Button>
          <Button
            variant="primary"
            className="w-25 mx-1 bg-primary px-2 py-1 d-inline-flex justify-content-center align-items-center"
            onClick={() => {
              setAddGeofence(false);
              setGeofencesToggle(true);
              setValidated(false);
              myMap.groups.drawGroup.clearLayers();
              drawer.disable();
              setLoading(false);
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
            <span>{t("Cancel")}</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddModal;
