import React from "react";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Button, Card, Row } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import { useEffect, useCallback, useState, useMemo } from "react";
import useStreamDataState from "hooks/useStreamDataState";
import { encryptName } from "helpers/encryptions";
import { Formik, Form } from "formik";
import { addPreventiveMaintenanceValidation } from "helpers/yup-validations/preventiveMaintenance-driversManagement/yupValidations";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import {
  confirmPreventive,
  addNewPreventive,
} from "services/preventiveMaintenance";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Model from "components/UI/Model";

const FormikAdd = () => {
  const { t } = useTranslation("preventiveMaintenance");
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedVehiclesData, setSelectedVehiclesData] = useState([]);
  const [periodType, setPeriodType] = useState("");
  const [fixedDateCase, setFixedDateCase] = useState(false);
  const [notifyType, setNotifyType] = useState("");
  const [valueNotifyType, setValueNotifyType] = useState(false);
  const [maintenanceDueValue, setMaintenanceDueValue] = useState("");
  const [startValue, setStartValue] = useState([]);
  const [nextValue, setNextValue] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [percentageValue, setPercentageValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [valueNotifyPeriodError, setValueNotifyPeriodError] = useState(false);

  const [loading, setloading] = useState(false);
  const [submitedData, setSubmitedData] = useState(false);
  const [replaceClicked, setReplaceClicked] = useState(false);

  // data for select boxes
  const optionsMaintenanceType = useMemo(
    () => [
      {
        value: 1,
        label: t("engine_oil_change_key"),
      },
      {
        value: 2,
        label: t("change_vehicle_brakes_key"),
      },
      {
        value: 3,
        label: t("vehicle_license_renew_key"),
      },
      {
        value: 4,
        label: t("vehicle_wash_key"),
      },
      {
        value: 5,
        label: t("tires_change_key"),
      },
      {
        value: 6,
        label: t("transmission_oil_change_key"),
      },
      {
        value: 7,
        label: t("filter_change_key"),
      },
      {
        value: 8,
        label: t("others_key"),
      },
    ],
    [t]
  );
  const optionsPeriodType = useMemo(
    () => [
      {
        value: 1,
        label: t("by_mileage_key"),
      },
      {
        value: 2,
        label: t("by_fixed_date_key"),
      },
      {
        value: 4,
        label: t("by_working_hours_key"),
      },
    ],
    [t]
  );
  const optionsNotifyPeriod = useMemo(
    () => [
      {
        value: "1",
        label: t("percentage_key"),
      },
      {
        value: "2",
        label: t("value_key"),
      },
    ],
    [t]
  );

  // minimum date used in date inputs
  const minDate = new Date().toISOString().slice(0, 10);

  // update localstorage with new vehicles data
  const { indexStreamLoader } = useStreamDataState();
  useEffect(() => {
    indexStreamLoader();
  }, []);

  // helper func to make Mileage and working hours logic
  const periodTypeFunc = useCallback(
    (vehiclesData, vehiclesDataType) => {
      setStartValue(
        vehiclesData?.length === 1
          ? [vehiclesDataType[0]]
          : vehiclesData?.length > 1
          ? vehiclesDataType
          : 0
      );

      setNextValue(
        vehiclesData?.length === 1
          ? [vehiclesDataType[0] + +maintenanceDueValue]
          : vehiclesData?.length > 1
          ? vehiclesDataType.map((vehicle) => vehicle + +maintenanceDueValue)
          : 0
      );

      // if user choose percentage then we need to calculate the value
      if (notifyType === "1") {
        setValueNotifyType(false);
        setWhenValue(
          vehiclesData?.length === 1
            ? [
                vehiclesDataType[0] +
                  +maintenanceDueValue * (+percentageValue / 100),
              ]
            : vehiclesData?.length > 1
            ? vehiclesDataType.map(
                (vehicle) =>
                  vehicle + +maintenanceDueValue * (+percentageValue / 100)
              )
            : 0
        );
        // delete Value Notify Period Error if Percentage selected
        setValueNotifyPeriodError(false);
        // if user choose value logic
      } else if (notifyType === "2") {
        setValueNotifyType(true);
      }
      setFixedDateCase(false);
    },
    [notifyType, percentageValue, maintenanceDueValue]
  );

  // fetch all vehicles data form local storage
  useEffect(() => {
    const userData =
      localStorage.getItem(encryptName("userData")) &&
      JSON.parse(localStorage.getItem(encryptName("userData")) || {});
    setVehicles(userData?.vehData);

    // add selected vehciles to state
    const vehiclesData = userData?.vehData?.filter((driver) =>
      selectedVehicles.includes(driver.VehicleID)
    );
    setSelectedVehiclesData(vehiclesData);

    const vehiclesMileage = vehiclesData?.map(
      (vehicle) => +(vehicle.Mileage / 1000).toFixed(2)
    );
    const vehiclesHours = vehiclesData?.map((vehicle) =>
      Math.round(vehicle.WorkingHours / 60 / 60)
    );

    // conditions of period Type equal to Mileage
    if (periodType === 1) {
      periodTypeFunc(vehiclesData, vehiclesMileage);
      // conditions of period Type equal to WorkingHours
    } else if (periodType === 4) {
      periodTypeFunc(vehiclesData, vehiclesHours);
      // conditions of period Type equal to Fixed Date
    } else if (periodType === 2) {
      setFixedDateCase(true);
      const today = new Date().toISOString().slice(0, 10);
      setStartValue(today);
      setNextValue(maintenanceDueValue);
    }
  }, [selectedVehicles, periodType, periodTypeFunc, maintenanceDueValue]);

  // vehicles options to select a vehicle or more
  const vehiclesOptions = vehicles?.map((vehicle) => {
    return {
      value: vehicle?.VehicleID,
      label: vehicle?.DisplayName,
    };
  });

  // helper function to make add request
  const postData = useCallback(
    async (data) => {
      try {
        const postData = await addNewPreventive(data);
        toast.success(postData.result);
        router.push("/preventive-maintenance");
        setloading(false);
        setReplaceClicked(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setloading(false);
        setShowModal(false);
        setReplaceClicked(false);
      }
    },
    [router]
  );

  // initial Values needed for formik
  const initialValues = {
    selectedVehicles: [],
    MaintenanceType: 1,
    PeriodType: 1,
    StartValue: 0,
    MaintenanceDueValue: "",
    NextValue: 0,
    NotifyByEmail: "",
    Recurring: [],
    NotifyByPush: [],
    NotifMessage: "",
    WhenPeriod: "1",
    PercentageValue: "",
    WhenValue: "",
  };

  // control input values on formik
  const getFormData = (values) => {
    setSelectedVehicles(values.selectedVehicles);
    setPeriodType(values.PeriodType);
    setNotifyType(values.WhenPeriod);
    setMaintenanceDueValue(values.MaintenanceDueValue);
    setPercentageValue(values.PercentageValue);
    if (values.PeriodType === 2) {
      setWhenValue(values.WhenValue);
    }
    if (notifyType === "2") {
      setWhenValue(values.WhenValue);
    }
  };

  // submit form
  const onSubmit = async (data) => {
    const StartValue =
      startValue?.length > 1 && typeof startValue !== "string"
        ? [...startValue]
        : startValue;
    const NextValue =
      nextValue?.length > 1 && typeof nextValue !== "string"
        ? [...nextValue]
        : nextValue;
    const WhenValue =
      whenValue?.length > 1 && typeof whenValue !== "string"
        ? [...whenValue]
        : whenValue;
    const VehicleId = data?.selectedVehicles;

    const Vehicles = VehicleId?.map((id, index) => {
      return {
        vehicleId: id,
        StartValue: periodType === 2 ? StartValue : StartValue[index],
        NextValue: periodType === 2 ? NextValue : NextValue[index],
        WhenValue:
          periodType === 2
            ? WhenValue
            : notifyType === "2"
            ? WhenValue
            : WhenValue[index],
      };
    });

    const submitedData = {
      MaintenanceDueValue: data.MaintenanceDueValue,
      NotifMessage: data.NotifMessage,
      NotifyByEmail: data.NotifyByEmail,
      PercentageValue: data.PercentageValue,
      Vehicles,
      Recurring: data.Recurring.length === 1 ? 1 : 0,
      NotifyByPush: data.NotifyByPush.length === 1 ? 1 : 0,
      MaintenanceType: data.MaintenanceType,
      PeriodType: data.PeriodType,
      NotifyPeriod: data.WhenPeriod,
      WhenPeriod: data.WhenPeriod,
      NotifyBySMS: null,
      IsNotified: null,
    };
    setSubmitedData(submitedData);

    // validation when select more than one vehicle and select value option in period type
    if (selectedVehicles.length > 1 && notifyType === "2" && periodType !== 2) {
      setValueNotifyPeriodError(true);
      return;
    }
    setValueNotifyPeriodError(false);

    setloading(true);
    try {
      const confirmData = await confirmPreventive(submitedData);
      if (confirmData.result) {
        setShowModal(true);
      } else {
        await postData(submitedData);
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      setloading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Card>
        <Card.Header className="h3">
          {t("add_maintenance_plan_key")}
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={addPreventiveMaintenanceValidation(
              fixedDateCase,
              minDate,
              startValue,
              nextValue,
              selectedVehiclesData,
              t
            )}
            onSubmit={onSubmit}
          >
            {(formik) => {
              setTimeout(() => getFormData(formik.values), 0);
              return (
                <Form>
                  <Row>
                    <ReactSelect
                      options={vehiclesOptions}
                      label={t("select_vehicles_key")}
                      name="selectedVehicles"
                      placeholder={t("select_vehicles_key")}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                      isMulti={true}
                    />

                    <ReactSelect
                      options={optionsMaintenanceType}
                      label={t("maintenance_type_key")}
                      name="MaintenanceType"
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                    />

                    <ReactSelect
                      options={optionsPeriodType}
                      label={t("period_type_key")}
                      placeholder={t("period_type_key")}
                      name="PeriodType"
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                    />

                    {!(selectedVehiclesData?.length > 1) && !fixedDateCase && (
                      <Input
                        label={t("start_value_key")}
                        placeholder={t("start_value_key")}
                        name="StartValue"
                        type="number"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                        value={(formik.values.StartValue = startValue)}
                      />
                    )}

                    <Input
                      label={t("maintenance_due_value_key")}
                      placeholder={t("maintenance_due_value_key")}
                      name="MaintenanceDueValue"
                      type={fixedDateCase ? "date" : "number"}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      min={fixedDateCase ? minDate : 0}
                      onFocus={(event) => event.target.select()}
                    />

                    {!(selectedVehiclesData?.length > 1) && !fixedDateCase && (
                      <Input
                        label={t("next_value_key")}
                        placeholder={t("next_value_key")}
                        name="NextValue"
                        type="number"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                        value={(formik.values.NextValue = nextValue)}
                      />
                    )}

                    <Input
                      label={t("email_address_key")}
                      placeholder={t("email_address_key")}
                      type="email"
                      name="NotifyByEmail"
                      className={"col-12 col-md-6 col-lg-4 mb-2"}
                    />

                    <Row className="d-flex  justify-content-start my-2">
                      <Checkbox
                        name="Recurring"
                        option={[
                          {
                            value: "1",
                            key: `${t("recurring_key")}`,
                          },
                        ]}
                        className={"col-6 col-lg-3"}
                        disabled={fixedDateCase ? true : false}
                      />
                      <Checkbox
                        className="col-6 col-lg-3"
                        name="NotifyByPush"
                        option={[
                          {
                            value: "true",
                            key: `${t("notify_by_push_key")}`,
                          },
                        ]}
                      />
                    </Row>

                    <Row>
                      <Input
                        type="text"
                        name="NotifMessage"
                        label={t("notify_message_key")}
                        placeholder={t("notify_message_key")}
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                      />
                    </Row>

                    <ReactSelect
                      className={`col-12 col-md-6 col-lg-4 ${
                        valueNotifyPeriodError ? "" : "mb-3"
                      } `}
                      options={
                        selectedVehiclesData?.length > 1
                          ? [optionsNotifyPeriod[0]]
                          : optionsNotifyPeriod
                      }
                      label={`${t("notify_period_key")}`}
                      placeholder={`${t("notify_period_key")}`}
                      name="WhenPeriod"
                      isDisabled={fixedDateCase ? true : false}
                      isSearchable={true}
                    />
                    {valueNotifyPeriodError && (
                      <span
                        className="mb-3"
                        style={{ color: "red", fontSize: "12px" }}
                      >
                        {t("please_select_percentage_key")}
                      </span>
                    )}

                    {!valueNotifyType && !fixedDateCase && (
                      <Input
                        type="number"
                        name="PercentageValue"
                        label={t("percentage_value_key")}
                        placeholder={t("percentage_value_key")}
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                      />
                    )}

                    {!(selectedVehiclesData?.length > 1) || fixedDateCase ? (
                      <Input
                        type={fixedDateCase ? "date" : "number"}
                        name="WhenValue"
                        label={t("notify_when_value_key")}
                        placeholder={t("notify_when_value_key")}
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={
                          valueNotifyType || fixedDateCase ? false : true
                        }
                        value={
                          !fixedDateCase &&
                          !valueNotifyType &&
                          (formik.values.WhenValue = whenValue)
                        }
                        min={fixedDateCase ? minDate : 0}
                      />
                    ) : null}
                  </Row>
                  <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                    <Button
                      type="submit"
                      disabled={loading || selectedVehicles.length === 0}
                      className="px-3 py-2 text-nowrap me-3 ms-0  mb-2 mb-md-0"
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
                      {t("save_key")}
                    </Button>
                    <Button className="px-3 py-2 text-nowrap me-3 ms-0 ">
                      <Link href="/preventive-maintenance" passHref>
                        <div>
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faTimes}
                            size="sm"
                          />
                          {t("cancel_key")}
                        </div>
                      </Link>
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          {/* confirm Model if preventive repeated */}
          <Model
            header={t("add_maintenance_plan_warning_key")}
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setloading(false);
            }}
            onUpdate={async () => {
              setReplaceClicked(true);
              await postData(submitedData);
            }}
            updateButton={t("replace_key")}
            disabled={replaceClicked ? true : false}
          >
            <h5 className="text-center opacity-50">
              {t(
                "there_are_already_plans_with_the_same_type_created_for_some_of_the_vehicles_you_have_selected_key"
              )}
              .
            </h5>
          </Model>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FormikAdd;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "preventiveMaintenance",
        "main",
      ])),
    },
  };
}
// translation ##################################
