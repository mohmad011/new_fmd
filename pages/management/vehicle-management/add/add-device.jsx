import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faForward,
  faArrowLeft,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { vehicleAddDevice } from "helpers/yup-validations/management/VehicleManagement";
import { fetchAllUnAssignedDevicesData } from "services/management/VehicleManagement";
import Model from "components/UI/Model";
import { useDispatch, useSelector } from "react-redux";
import { addDevice, resetData } from "lib/slices/addNewVehicle";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const AddDeviceToVeh = () => {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [unAssignedDevicesOptions, setUnAssignedDevicesOptions] = useState([]);
  const [allDeviceTypesOptions, setAllDeviceTypesOptions] = useState([]);
  const [disableInputs, setDisableInputs] = useState(false);
  const [serialNumberInput, setSerialNumberInput] = useState("");
  const [chosenType, setChosenType] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const vehicle = useSelector((state) => state.addNewVehicle.vehicle);
  const { t } = useTranslation("management");

  // route away when use direct link
  useEffect(() => {
    if (Object.keys(vehicle).length < 1) {
      router.push("/management/vehicle-management/add/vehicle-data");
    }
  }, [vehicle, router]);

  // prevent reload page
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  // reset sim data at first render
  useEffect(() => {
    dispatch(addDevice({}));
  }, [dispatch]);

  // fecth all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllUnAssignedDevicesData();
        const unAssignedDevices = respond.unAssignedDevices.map((ele) => {
          return {
            value: ele.SerialNumber,
            label: ele.SerialNumber,
            typeID: ele.DeviceTypeID,
          };
        });
        setUnAssignedDevicesOptions([
          { value: "add", label: t("add_new_device_key"), typeID: "new" },
          ...unAssignedDevices,
        ]);
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
  }, [t]);

  const onSubmit = async (data) => {
    const submitData = {
      serialNumber: data.serialNumber,
      deviceTypeId: chosenType ? chosenType : data.deviceTypeId,
    };
    dispatch(addDevice(submitData));
    router.push("/management/vehicle-management/add/add-sim");
  };

  const initialValues = {
    deviceSelected: [
      { value: "add", label: t("add_new_device_key"), typeID: "new" },
    ],
    serialNumber: "",
    deviceTypeId: 1,
  };

  const getFormData = (values) => {
    //disable inputs when choose any device
    if (values.deviceSelected[0].value !== "add") {
      setDisableInputs(true);
      //assgin value of choosen to input
      setSerialNumberInput(values.deviceSelected[0]?.label);
      setChosenType(values.deviceSelected[0]?.typeID);
    } else {
      setDisableInputs(false);
      setSerialNumberInput("");
      setChosenType("");
    }
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
                      <Col className="mx-auto" md={5}>
                        <Row>
                          <h4 className="mb-3">
                            {t("select_exist_device_key")}
                          </h4>
                          <ReactSelect
                            options={unAssignedDevicesOptions}
                            label={t("select_a_device_key")}
                            placeholder={t("select_a_device_key")}
                            name="deviceSelected"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isObject={true}
                          />

                          <h4 className="mb-3">{t("add_a_new_device_key")}</h4>
                          <Input
                            placeholder={t("serial_number_key")}
                            label={t("serial_number_key")}
                            name="serialNumber"
                            type="text"
                            className={"col-12 mb-3"}
                            disabled={disableInputs ? true : false}
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
                            isDisabled={disableInputs ? true : false}
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
                      <Col className="mx-auto" md={5}>
                        <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              router.push(
                                "/management/vehicle-management/add/vehicle-data"
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faArrowLeft}
                              size="sm"
                            />
                            {t("back_key")}
                          </Button>
                          <Button
                            type="submit"
                            className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faArrowRight}
                              size="sm"
                            />
                            {t("next_key")}
                          </Button>
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              router.push(
                                "/management/vehicle-management/add/add-group"
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faForward}
                              size="sm"
                            />
                            {t("skip_key")}
                          </Button>
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              setModalShow(true);
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
            {modalShow && (
              <Model
                header={t("cancel_the_process_key")}
                show={modalShow}
                onHide={() => setModalShow(false)}
                updateButton={t("yes,_i'm_sure_key")}
                onUpdate={() => {
                  dispatch(resetData());
                  router.push("/management/vehicle-management");
                }}
              >
                <h4 className="text-center">
                  {t("are_you_sure_you_want_to_cancel_this_process_key")}
                </h4>
                <p className="text-center text-danger">
                  {t(
                    "you_will_lose_all_your_entered_data_if_you_cancel_the_process_key"
                  )}
                  .
                </p>
              </Model>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AddDeviceToVeh;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "management"])),
    },
  };
}
// translation ##################################
