import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { vehicleAddDevice } from "helpers/yup-validations/management/VehicleManagement";
import {
  fetchUnassignedDevices,
  assignSimToDevice,
} from "services/management/SimManagement";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const AddSimToDevice = ({ id, handleModel }) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [unAssignedDevicesOptions, setUnAssignedDevicesOptions] = useState([]);
  const [allDeviceTypesOptions, setAllDeviceTypesOptions] = useState([]);
  const [serialNumberInput, setSerialNumberInput] = useState("");
  const [chosenType, setChosenType] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("management");

  // fetch all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchUnassignedDevices();
        const unAssignedDevices = respond.unAssignedDevices.map((ele) => {
          return {
            value: ele.DeviceID,
            label: ele.SerialNumber,
            typeID: ele.DeviceTypeID,
          };
        });
        setUnAssignedDevicesOptions(unAssignedDevices);
        setAllDeviceTypesOptions(
          respond?.allDeviceTypes?.map((ele) => {
            return { value: ele.ID, label: ele.DeviceType };
          })
        );
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const submitData = {
      deviceId: deviceId,
    };
    setLoading(true);
    try {
      const respond = await assignSimToDevice(id,submitData);
      toast.success("Device Added to Vehicle Successfully");
      setLoading(false);
      handleModel();
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const initialValues = {
    deviceSelected: [],
    serialNumber: "",
    deviceTypeId: 1,
  };

  const getFormData = (values) => {
    //assign value of chosen to input
    setDeviceId(values.deviceSelected[0]?.value);
    setSerialNumberInput(values.deviceSelected[0]?.label);
    setChosenType(values.deviceSelected[0]?.typeID);
  };

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {allDeviceTypesOptions.length > 0 && (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleAddDevice(t)}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto" md={10}>
                        <Row>
                          <h4 className="mb-3">{t("select_exist_device_key")}</h4>
                          <ReactSelect
                            options={unAssignedDevicesOptions}
                            label={t("select_a_device_key")}
                            placeholder={t("select_a_device_key")}
                            name="deviceSelected"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isObject={true}
                          />

                          <Input
                            placeholder={t("serial_number_key")}
                            label={t("serial_number_key")}
                            name="serialNumber"
                            type="text"
                            className={"col-12 mb-3"}
                            disabled={true}
                            onFocus={(event) => event.target.select()}
                            value={
                              serialNumberInput &&
                              (formik.values.serialNumber = serialNumberInput)
                            }
                          />

                          <ReactSelect
                            options={allDeviceTypesOptions}
                            label={t("device_type_key")}
                            placeholder={t("select_device_type_key")}
                            name="deviceTypeId"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isDisabled={true}
                            value={
                              chosenType
                                ? allDeviceTypesOptions.find(
                                    (option) => option.value === chosenType
                                  )
                                : allDeviceTypesOptions.find(
                                    (option) =>
                                      option.value ===
                                      formik.values.deviceTypeId
                                  )
                            }
                          />
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mx-auto" md={10}>
                        <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                          >
                            {!loading ? (
                              <FontAwesomeIcon
                                className="mx-2"
                                icon={faCheck}
                                size="sm"
                              />
                            ) : (
                              <FontAwesomeIcon
                                className="mx-2 fa-spin"
                                icon={faSpinner}
                                size="sm"
                              />
                            )}
                            {t("assign_key")}
                          </Button>
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              handleModel();
                            }}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faTimes}
                              size="sm"
                            />
                          {t("cancel_key")}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AddSimToDevice;
