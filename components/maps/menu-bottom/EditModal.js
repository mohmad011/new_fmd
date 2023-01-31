import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import config from "config/config";
import { CustomInput } from "../../CustomInput";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const EditModal = ({
  validated,
  setAddGeofence,
  setGeofencesToggle,
  setValidated,
  ID,
  setData_table,
  Data_table,
  editGeofence,
  setEditGeofence,
  myMap,
  setGeofencesViewToggle,
}) => {
  const { t } = useTranslation("Table");
  const [EditModalData, setEditModalData] = useState({
    GeofenceName: "",
    Speed: "",
    Email: "",
  });

  const [loading, setLoading] = useState(false);
  const [speedMsg, setSpeedMsg] = useState("");
  const { darkMode } = useSelector((state) => state.config);

  useEffect(() => {
    if (editGeofence) {
      let Data_tableFiltered = Data_table.filter((item) => item.ID === ID)[0];
      setEditModalData(Data_tableFiltered);
      switch (Data_tableFiltered.GeoFenceType) {
        case 1:
          L.polygon(Data_tableFiltered.GeofencePath, { color: "red" }).addTo(
            myMap.groups.drawGroup
          );
          break;
        case 2:
          L.circle(Data_tableFiltered.GeofencePath, {
            color: "red",
            radius: +Data_tableFiltered?.GeofenceRadius,
          }).addTo(myMap.groups.drawGroup);
          break;
        case 3:
          L.rectangle(Data_tableFiltered.GeofencePath, {
            color: "red",
          }).addTo(myMap.groups.drawGroup);
          break;
      }
    }
  }, [ID, editGeofence]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValidated = EditModalData.Email
      ? EditModalData.Email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      : null;

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

    try {
      const resp = await axios.put(
        `${config.apiGateway.URL}geofences/${ID}`,
        { ...EditModalData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        Data_table?.map((item) => {
          if (item.ID === ID) {
            item.GeofenceName = EditModalData.GeofenceName;
            item.Speed = EditModalData.Speed;
          }
        });
        setData_table([...Data_table]);
        myMap.groups.drawGroup.clearLayers();
        setGeofencesViewToggle(false);
      }
    } catch (e) {
      console.log(" Error: " + e.message);
      toast.error(`Error: Can Not Updated Geofence `);
    }

    if (myMap.groups.drawGroup.getLayers().length == 0) {
      setTimeout(() => {
        toast.success("Geofence Updated Successfully.");
        setValidated(false);
        setGeofencesToggle(true);
        setAddGeofence(false);
        setEditGeofence(false);
        setLoading(false);
      }, 500);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditModalData({
      ...EditModalData,
      [name]: value,
    });
  };

  const checkIfNumber = (e) => {
    return !/[0-9]/.test(e.key) ? true : false;
  };

  const handleSpeedOnKeyPress = (e) => {
    if (checkIfNumber(e)) {
      e.preventDefault();

      setSpeedMsg("Please_Enter_Number_Only!");
    } else {
      setSpeedMsg("");
    }
  };

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
            required={true}
            value={EditModalData.GeofenceName}
            handleChange={handleChange}
            Name="GeofenceName"
            Label={t("Geofence_Name")}
          />

          <Form.Group
            className={`col-12 col-md-6 col-lg-4 mb-3`}
            controlId="Geofence Speed"
          >
            <Form.Label>{t("Geofence_Speed")}</Form.Label>
            <Form.Control
              className="border-primary fw-bold"
              name="Speed"
              value={EditModalData.Speed}
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
            required={false}
            value={EditModalData.Email}
            handleChange={handleChange}
            Name="Email"
            Label={t("Notify_Email")}
          />
        </Row>
        <div className="w-50">
          <Button
            className="me-2 px-2 py-1 w-25 bg-primary d-inline-flex justify-content-center align-items-center"
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
            className="px-2 py-1 w-25 bg-primary d-inline-flex justify-content-center align-items-center"
            onClick={() => {
              setAddGeofence(false);
              setEditGeofence(false);
              setGeofencesToggle(true);
              setValidated(false);
              setLoading(false);
              setGeofencesViewToggle(false);
              myMap.groups.drawGroup.clearLayers();
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

export default EditModal;
