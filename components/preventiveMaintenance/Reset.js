import React, { useState, useMemo } from "react";
import Input from "components/formik/Input";
import RadioInput from "components/formik/RadioInput";
import { Formik, Form } from "formik";
import { Button, Row } from "react-bootstrap";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";

const Reset = ({ data, handleModel }) => {
  const { plateNumber, maintenanceType, periodType, startValue, nextValue } =
    data;

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("preventiveMaintenance");

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
        value: 3,
        label: t("by_working_hours_key"),
      },
    ],
    [t]
  );

  const resetMaintenanceType = optionsMaintenanceType.filter(
    (ele) => ele.value === +maintenanceType
  )[0].label;
  const resetPeriodType = optionsPeriodType.filter(
    (ele) => ele.value === +periodType
  )[0].label;

  const radioOptions = useMemo(
    () => [
      { key: `${t("current_value_key")}: ${nextValue}`, value: "current" },
      { key: `${t("original_value_key")}: ${startValue}`, value: "original" },
    ],
    [t, nextValue, startValue]
  );

  const initialValues = {
    PlateNumber: plateNumber,
    MaintenanceType: resetMaintenanceType,
    PeriodType: resetPeriodType,
    selectedRadio: "",
  };

  const onSubmit = (data) => {
    console.log(data);
    handleModel();
  };

  return (
    <div className="ms-3">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <Row>
                <Input
                  placeholder={t("plate_number_key")}
                  label={t("plate_number_key")}
                  name="PlateNumber"
                  type="text"
                  className={"col-12 col-md-6 col-lg-4 mb-3"}
                  disabled={true}
                />

                <Input
                  placeholder={t("select_maintenance_type_key")}
                  label={t("maintenance_type_key")}
                  name="MaintenanceType"
                  type="text"
                  className={"col-12 col-md-6 col-lg-4 mb-3"}
                  disabled={true}
                />

                <Input
                  placeholder={t("select_period_type_key")}
                  label={t("period_type_key")}
                  name="PeriodType"
                  type="text"
                  className={"col-12 col-md-6 col-lg-4 mb-3"}
                  disabled={true}
                />
              </Row>
              <Row className="mb-4">
                <RadioInput
                  label={t("reset_by_key") + ":"}
                  options={radioOptions}
                  name="selectedRadio"
                />
              </Row>
              <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                <Button
                  type="submit"
                  // disabled={loading || selectedVehicles.length === 0}
                  className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
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
                  {t("submit_key")}
                </Button>
                <Button
                  className="px-3 py-2 text-nowrap me-3 ms-0 "
                  onClick={() => {
                    handleModel();
                  }}
                >
                  <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
                  {t("cancel_key")}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Reset;
