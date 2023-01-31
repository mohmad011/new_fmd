import React, { useEffect, useState } from "react";
import {
  editVehicle,
  fetchAllSelectionsData,
  fetchVehicleGroups,
  updateVehicle,
} from "/services/management/VehicleManagement";
import { toast } from "react-toastify";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { vehicleDataValidation } from "helpers/yup-validations/management/VehicleManagement";
import { useRouter } from "next/router";
import Textarea from "components/formik/Textarea";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const Edit = ({
  id,
  handleModel,
  icon,
  editModel,
  modelButtonMsg,
  className,
  updateAssignedTable,
  updateUnassignedTable,
  onModelButtonClicked,
}) => {
  const [data, setData] = useState({});
  const { t } = useTranslation("management");
  const [loadingPage, setLoadingPage] = useState(true);
  const [selectionData, setSelectionData] = useState({});
  const [wirteInOptional, setWirteInOptional] = useState(false);
  const router = useRouter();
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch group selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchVehicleGroups();
        const groups = respond.result.map((ele) => {
          return {
            value: ele.ID,
            label: ele.Name,
          };
        });
        setGroupsOptions([{ value: "", label: "No Group" }, ...groups]);
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    };
    fetchData();
  }, []);

  // fetch all selections data(model,manufacturing company,vehicle type)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllSelectionsData();
        setSelectionData(respond);
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    };
    fetchData();
  }, []);

  const ManufactCompanyName = selectionData?.allMakes?.map((ele) => {
    return { value: ele.ID, label: ele.Make };
  });

  const model = selectionData?.allModels?.map((ele) => {
    return { value: ele.ID, label: ele.Model };
  });

  const vehicleType = selectionData?.allTypes?.map((ele) => {
    return { value: ele.ID, label: ele.TypeName };
  });

  // fetch vehicle data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await editVehicle(id);
        setData(respond.Vehicle);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      LiterPer100KM: data.LiterPer100KM > 0 ? data.LiterPer100KM : null,
      Number: data.Number.trim().length > 0 ? data.Number : null,
      PlateType: data.PlateType > 0 ? data.PlateType : null,
      RequiredRFID: data.RequiredRFID.length > 0 ? 1 : 0,
      HaveIgnition: data.HaveIgnition.length > 0 ? 1 : 0,
      HaveRelay: data.HaveRelay.length > 0 ? 1 : 0,
      JedahIntegrated: data.JedahIntegrated.length > 0 ? 1 : 0,
      MakeID: data.MakeID > 1 ? data.MakeID : 1,
      ModelID: data.ModelID > 1 ? data.ModelID : 1,
      TypeID: data.TypeID > 1 ? data.TypeID : 1,
    };

    setLoading(true);
    try {
      const respond = await updateVehicle(id, submitData);
      toast.success(respond.Vehicle);
      setLoading(false);
      if (editModel) {
        handleModel();
        updateAssignedTable();
        updateUnassignedTable();
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const getFormData = (values) => {
    if (
      values.Number.trim().length > 0 ||
      values.RightLetter.trim().length > 0 ||
      values.MiddleLetter.trim().length > 0 ||
      values.LeftLetter.trim().length > 0 ||
      values.SequenceNumber.trim().length > 0 ||
      values.PlateType > 0 ||
      values.ImeiNumber.trim().length > 0
    ) {
      setWirteInOptional(true);
    } else {
      setWirteInOptional(false);
    }
  };

  const ManufacturingYear = data.MakeYear ? data.MakeYear.slice(0, 4) : "";

  const initialValues = {
    DisplayName: data.DisplayName || "",
    PlateNumber: data.PlateNumber || "",
    MakeID: data.MakeID || "",
    ModelID: data.ModelID || "",
    MakeYear: ManufacturingYear,
    TypeID: data.TypeID || "",
    Color: data.Color || "",
    Chassis: data.Chassis || "",
    SpeedLimit: data.SpeedLimit || 0,
    LiterPer100KM: data.LiterPer100KM !== null ? data.LiterPer100KM : 0,
    RequiredRFID: data.RequiredRFID === true ? ["1"] : [],
    HaveIgnition: data.HaveIgnition === true ? ["2"] : [],
    HaveRelay: data.HaveRelay === true ? ["3"] : [],
    JedahIntegrated: data.JedahIntegrated === true ? ["4"] : [],
    Number: data.Number !== null ? data.Number : "",
    RightLetter: data.RightLetter || "",
    MiddleLetter: data.MiddleLetter || "",
    LeftLetter: data.LeftLetter || "",
    SequenceNumber: data.SequenceNumber || "",
    PlateType: data.PlateType !== null ? data.PlateType : "",
    ImeiNumber: data.ImeiNumber || "",
    GroupID: data.GroupID || "",
    MaxParkingTime: data.MaxParkingTime || 0,
    MaxIdlingTime: data.MaxIdlingTime || 0,
    Remarks: data.Remarks || "",
    HeadWeight: data.HeadWeight || "",
    TailWeight: data.TailWeight || "",
    CargoWeight: data.CargoWeight || "",
    MaximumVoltage: data.MaximumVoltage || "",
    MinimumVoltage: data.MinimumVoltage || "",
  };

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {Object.keys(data).length > 0 && (
        <Card>
          {!editModel && (
            <Card.Header className="h3">
              {t("edit_vehicle_information_key")}
            </Card.Header>
          )}
          <Card.Body className={`${className}`}>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleDataValidation(wirteInOptional, t)}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Row>
                          <Input
                            placeholder={t("display_name_key")}
                            label={t("display_name_key")}
                            name="DisplayName"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("plate_number_key")}
                            label={t("plate_number_key")}
                            name="PlateNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <ReactSelect
                            options={ManufactCompanyName}
                            label={t("manufacturing_company_key")}
                            placeholder={t("select_manufacturing_company_key")}
                            name="MakeID"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            isSearchable={true}
                          />

                          <ReactSelect
                            options={model}
                            label={t("model_key")}
                            placeholder={t("select_model_key")}
                            name="ModelID"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            isSearchable={true}
                          />

                          <Input
                            placeholder={t("manufacturing_year_key")}
                            label={t("manufacturing_year_key")}
                            name="MakeYear"
                            type="number"
                            min={1800}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <ReactSelect
                            options={vehicleType}
                            label={t("vehicle_type_key")}
                            placeholder={t("select_vehicle_type_key")}
                            name="TypeID"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            isSearchable={true}
                          />

                          <Input
                            placeholder={t("color_key")}
                            label={t("color_key")}
                            name="Color"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("chassis_number_key")}
                            label={t("chassis_number_key")}
                            name="Chassis"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("speed_limit_key")}
                            label={t("speed_limit_key")}
                            name="SpeedLimit"
                            type="number"
                            min={0}
                            onFocus={(event) => event.target.select()}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("liter_per_100KM_key")}
                            label={t("liter_per_100KM_key")}
                            name="LiterPer100KM"
                            type="number"
                            min={0}
                            onFocus={(event) => event.target.select()}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("maximum_parking_time_key")}
                            label={t("maximum_parking_time_key")}
                            name="MaxParkingTime"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            min={0}
                            onFocus={(event) => event.target.select()}
                          />

                          <Input
                            placeholder={t("maximum_idling_time_key")}
                            label={t("maximum_idling_time_key")}
                            name="MaxIdlingTime"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            min={0}
                            onFocus={(event) => event.target.select()}
                          />

                          <Row className="d-flex  justify-content-start my-2">
                            <Checkbox
                              name="RequiredRFID"
                              option={[
                                {
                                  value: "1",
                                  key: t("required_RFID_key"),
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="HaveIgnition"
                              option={[
                                {
                                  value: "2",
                                  key: t("have_ignition_key"),
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="HaveRelay"
                              option={[
                                {
                                  value: "3",
                                  key: t("have_relay_key"),
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="JedahIntegrated"
                              option={[
                                {
                                  value: "4",
                                  key: t("jedah_integrated_key"),
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                          </Row>

                          <h4>{t("edit_groups_information_key")}</h4>
                          <ReactSelect
                            options={groupsOptions}
                            label={t("group_name_key")}
                            placeholder={t("select_a_group_name_key")}
                            name="GroupID"
                            className={"col-6 mb-3"}
                            isSearchable={true}
                          />

                          <Textarea
                            label={t("remarks_key")}
                            placeholder={t("add_remarks_key")}
                            name="Remarks"
                            className={"col-6 mb-3"}
                          />

                          <h4>{t("weight_sensor_setup_(optional)_key")}</h4>
                          <Input
                            placeholder={t("head_weight_key")}
                            label={t("head_weight_key")}
                            name="HeadWeight"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("tail_weight_key")}
                            label={t("tail_weight_key")}
                            name="TailWeight"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("cargo_weight_key")}
                            label={t("cargo_weight_key")}
                            name="CargoWeight"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("maximum_voltage_key")}
                            label={t("maximum_voltage_key")}
                            name="MaximumVoltage"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("minimum_voltage_key")}
                            label={t("minimum_voltage_key")}
                            name="MinimumVoltage"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <h4>{t("WASL_integration_(optional)_key")}</h4>
                          <Input
                            placeholder={t("number_key")}
                            label={t("number_key")}
                            name="Number"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("right_letter_key")}
                            label={t("right_letter_key")}
                            name="RightLetter"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("middle_letter_key")}
                            label={t("middle_letter_key")}
                            name="MiddleLetter"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("left_letter_key")}
                            label={t("left_letter_key")}
                            name="LeftLetter"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("sequence_number_key")}
                            label={t("sequence_number_key")}
                            name="SequenceNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("plate_type_key")}
                            label={t("plate_type_key")}
                            name="PlateType"
                            type="number"
                            min={0}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("IMEI_number_key")}
                            label={t("IMEI_number_key")}
                            name="ImeiNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                        </Row>
                      </Col>
                    </Row>

                    <Row>
                      <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                        {editModel && (
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
                            type="button"
                            onClick={onModelButtonClicked}
                          >
                            {modelButtonMsg}
                            {
                              <FontAwesomeIcon
                                className="mx-2"
                                icon={icon}
                                size="sm"
                              />
                            }
                          </Button>
                        )}
                        <Button
                          type="submit"
                          disabled={loading}
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
                          {t("save_change_key")}
                        </Button>
                        <Button
                          className="px-3 py-2 text-nowrap me-3 ms-0"
                          onClick={() => {
                            if (editModel) {
                              handleModel();
                            } else {
                              router.push("/management/vehicle-management/");
                            }
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

export default Edit;
