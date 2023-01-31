import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { vehicleAddSim } from "helpers/yup-validations/management/VehicleManagement";
import { fetchAllUnAssignedSimCardData } from "services/management/VehicleManagement";
import Model from "components/UI/Model";
import { useDispatch, useSelector } from "react-redux";
import { addSim, resetData } from "lib/slices/addNewVehicle";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const AddSimtoDevice = () => {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [unAssignedDevicesOptions, setUnAssignedSimCardsOptions] = useState([]);
  const [respond, setRespond] = useState([]);
  const [disableInputs, setDisableInputs] = useState(false);
  const [serialNumberInput, setSerialNumberInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
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
    dispatch(addSim({}));
  }, [dispatch]);

  // fetch all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllUnAssignedSimCardData();
        const unAssignedSimcards = respond.allSims.map((ele) => {
          return {
            value: ele.SimSerialNumber,
            label: ele.PhoneNumber,
            provID: ele.ProviderID,
          };
        });
        setUnAssignedSimCardsOptions([
          { value: "add", label: t("add_new_SIM_card_key"), provID: "new" },
          ...unAssignedSimcards,
        ]);
        setRespond(respond.allSims);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, [t]);

  const simProviderOtions = [
    { value: 1, label: t("mobily_key") },
    { value: 2, label: t("STC_key") },
    { value: 3, label: t("zain_key") },
    { value: 4, label: t("lebara_key") },
  ];

  const onSubmit = async (data) => {
    const submitData = {
      simSerialNumber: data.simSerialNumber,
      phoneNumber: data.phoneNumber,
      provider: chosenType ? chosenType : data.provider,
    };
    dispatch(addSim(submitData));
    router.push("/management/vehicle-management/add/add-group");
  };

  const initialValues = {
    simSelected: [{ value: "add", label: t("add_new_SIM_card_key"), provID: "new" }],
    simSerialNumber: "",
    phoneNumber: "",
    provider: 1,
  };

  const getFormData = (values) => {
    //disable inputs when choose any Sim
    if (values.simSelected[0].value !== "add") {
      setDisableInputs(true);
      //assgin value of chosen to input
      setSerialNumberInput(values.simSelected[0]?.label);
      setPhoneNumberInput(values.simSelected[0]?.value);
      setChosenType(values.simSelected[0]?.provID);
    } else {
      setDisableInputs(false);
      setSerialNumberInput("");
      setPhoneNumberInput("");
      setChosenType("");
    }
  };

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {respond.length > 0 && (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleAddSim(t)}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <Row>
                          <h4 className="mb-3">{t("select_exist_SIM_card_key")}</h4>
                          <ReactSelect
                            options={unAssignedDevicesOptions}
                            label={t("select_a_SIM_card_key")}
                            placeholder={t("select_a_SIM_card_key")}
                            name="simSelected"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isObject={true}
                          />

                          <h4 className="mb-3">{t("add_a_new_SIM_card_key")}</h4>
                          <Input
                            placeholder={t("serial_number_key")}
                            label={t("serial_number_key")}
                            name="simSerialNumber"
                            type="text"
                            className={"col-6 mb-3"}
                            disabled={disableInputs ? true : false}
                            onFocus={(event) => event.target.select()}
                            value={
                              serialNumberInput &&
                              (formik.values.simSerialNumber =
                                serialNumberInput)
                            }
                          />

                          <Input
                            placeholder={t("phone_number_key")}
                            label={t("phone_number_key")}
                            name="phoneNumber"
                            type="text"
                            className={"col-6 mb-3"}
                            disabled={disableInputs ? true : false}
                            onFocus={(event) => event.target.select()}
                            value={
                              phoneNumberInput &&
                              (formik.values.phoneNumber = phoneNumberInput)
                            }
                          />

                          <ReactSelect
                            options={simProviderOtions}
                            label={t("SIM_provider_key")}
                            placeholder={t("select_SIM_provider_key")}
                            name="provider"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isDisabled={disableInputs ? true : false}
                            value={
                              chosenType
                                ? simProviderOtions.find(
                                    (option) => option.value === chosenType
                                  )
                                : simProviderOtions.find(
                                    (option) =>
                                      option.value === formik.values.provider
                                  )
                            }
                          />
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              router.push(
                                "/management/vehicle-management/add/add-device"
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
                {t("you_will_lose_all_your_entered_data_if_you_cancel_the_process_key")}.
                </p>
              </Model>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AddSimtoDevice;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "management"])),
    },
  };
}
// translation ##################################
