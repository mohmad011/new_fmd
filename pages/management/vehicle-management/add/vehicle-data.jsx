import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import { vehicleDataValidation } from "helpers/yup-validations/management/VehicleManagement";
import { fetchAllSelectionsData } from "services/management/VehicleManagement";
import { useDispatch, useSelector } from "react-redux";
import { addVehicle } from "lib/slices/addNewVehicle";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const VehicleData = () => {
  const router = useRouter();
  const { t } = useTranslation("management");
  const [wirteInOptional, setWirteInOptional] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [selectionData, setSelectionData] = useState({});
  const dispatch = useDispatch();
  const vehicle = useSelector((state) => state.addNewVehicle.vehicle);

  // fecth all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllSelectionsData();
        setSelectionData(respond);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
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

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      LiterPer100KM: data.LiterPer100KM > 0 ? data.LiterPer100KM : null,
      Number: data.Number.trim().length > 0 ? data.Number : null,
      PlateType: data.PlateType > 0 ? data.PlateType : null,
      RequiredRFID: data.RequiredRFID.length > 0 ? 1 : 0,
      HaveIgnition: data.HaveIgnition.length > 0 ? 1 : 0,
      HaveRelay: data.HaveRelay.length > 0 ? 1 : 0,
      MakeID: data.MakeID > 1 ? data.MakeID : 1,
      ModelID: data.ModelID > 1 ? data.ModelID : 1,
      TypeID: data.TypeID > 1 ? data.TypeID : 1,
    };
    dispatch(addVehicle(submitData));
    router.push("/management/vehicle-management/add/add-device");
  };

  const isVehicleExist = Object.keys(vehicle).length > 0;

  const initialValues = {
    DisplayName: isVehicleExist ? vehicle.DisplayName : "",
    PlateNumber: isVehicleExist ? vehicle.PlateNumber : "",
    MakeID: isVehicleExist ? vehicle.MakeID : "",
    ModelID: isVehicleExist ? vehicle.ModelID : "",
    MakeYear: isVehicleExist ? vehicle.MakeYear : "",
    TypeID: isVehicleExist ? vehicle.TypeID : "",
    Color: isVehicleExist ? vehicle.Color : "",
    Chassis: isVehicleExist ? vehicle.Chassis : "",
    SpeedLimit: isVehicleExist ? vehicle.SpeedLimit : 0,
    LiterPer100KM: isVehicleExist
      ? vehicle.LiterPer100KM !== null
        ? vehicle.LiterPer100KM
        : 0
      : 0,
    RequiredRFID: isVehicleExist
      ? vehicle.RequiredRFID === 1
        ? ["1"]
        : []
      : [],
    HaveIgnition: isVehicleExist
      ? vehicle.HaveIgnition === 1
        ? ["2"]
        : []
      : [],
    HaveRelay: isVehicleExist ? (vehicle.HaveRelay === 1 ? ["3"] : []) : [],
    Number: isVehicleExist
      ? vehicle.Number !== null
        ? vehicle.Number
        : ""
      : "",
    RightLetter: isVehicleExist ? vehicle.RightLetter : "",
    MiddleLetter: isVehicleExist ? vehicle.MiddleLetter : "",
    LeftLetter: isVehicleExist ? vehicle.LeftLetter : "",
    SequenceNumber: isVehicleExist ? vehicle.SequenceNumber : "",
    PlateType: isVehicleExist
      ? vehicle.PlateType !== null
        ? vehicle.PlateType
        : ""
      : "",
    ImeiNumber: isVehicleExist ? vehicle.ImeiNumber : "",
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

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {Object.keys(selectionData).length > 0 && (
        <Card>
          <Card.Header className="h3">{t("add_new_vehicle_key")}</Card.Header>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleDataValidation(wirteInOptional,t)}
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
                          </Row>

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
                            router.push("/management/vehicle-management/");
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

export default VehicleData;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "management"])),
    },
  };
}
// translation ##################################
