import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Input from "components/formik/Input";
import { getDriverDataToEdit, updateDriver } from "services/driversManagement";
import { addEditOperateDriver } from "helpers/yup-validations/preventiveMaintenance-driversManagement/yupValidations";
import { useTranslation } from "next-i18next";
import Spinner from "components/UI/Spinner";

export default function Edit({
  id,
  model,
  modelButtonMsg,
  onModelButtonClicked,
  icon,
  className,
  handleModel,
  updateTable,
}) {
  const { t } = useTranslation("driversManagement");
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setloading] = useState(false);
  const [Data, setData] = useState({});

  // make min birthday is 17 years old from today
  const date = new Date().setFullYear(new Date().getFullYear() - 17);
  const maxLicenceBirthDate = new Date(date).toISOString().slice(0, 10);

  //make min licence expire Date is today
  const minLicenceExDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const respond = await getDriverDataToEdit(id);
        setLoadingPage(false);
        let driver = respond?.driver[0];
        delete driver.DriverID;
        driver.IsDeleted = driver.IsDeleted ? 1 : 0;
        setData(driver);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoadingPage(false);
      }
    };
    fetchDriver();
  }, [id]);

  const initialValues = {
    FirstName: Data.FirstName === "null" ? "" : Data.FirstName,
    LastName: Data.LastName === "null" ? "" : Data.LastName,
    DateOfBirth: Data.DateOfBirth === "null" ? "" : Data.DateOfBirth,
    Nationality: Data.Nationality === "null" ? "" : Data.Nationality,
    PhoneNumber: Data.PhoneNumber === "null" ? "" : Data.PhoneNumber,
    Email: Data.Email === "null" ? "" : Data.Email,
    DLNumber: Data.DLNumber === "null" ? "" : Data.DLNumber,
    DLExpirationDate:
      Data.DLExpirationDate === "null" ? "" : Data.DLExpirationDate,
    Department: Data.Department === "null" ? "" : Data.Department,
    RFID: Data.RFID === "null" ? "" : Data.RFID,
    Image: Data.Image === "null" ? "" : Data.Image,
    SelectedVehiclePlateNumber:
      Data.SelectedVehiclePlateNumber === "null"
        ? ""
        : Data.SelectedVehiclePlateNumber,
    IdentityNumber: Data.IdentityNumber === "null" ? "" : Data.IdentityNumber,
    DateOfBirthHijri:
      Data.DateOfBirthHijri === "null" ? "" : Data.DateOfBirthHijri,
    MobileNumber: Data.MobileNumber === "null" ? "" : Data.MobileNumber,
  };

  const onSubmit = async (data) => {
    const submitData = {
      ...Data,
      ...data,
      DLNumber: `${data.DLNumber}`,
      MobileNumber: `${data.MobileNumber}`,
      PhoneNumber: `${data.PhoneNumber}`,
    };

    setloading(true);
    try {
      await updateDriver(id, submitData);
      toast.success(t("driver_updated_successfully_key"));
      router.push("/drivers-management");
      setloading(false);
      if (model) {
        handleModel();
        updateTable();
      }
    } catch (error) {
      toast.error(`Error: ${error?.response.data.message}`);
      setloading(false);
    }
  };

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {Object.keys(Data).length > 1 && (
        <Card className="mb-1">
          {!model && (
            <Card.Header className="h3">{t("update_driver_key")}</Card.Header>
          )}
          <Card.Body className={`${className}`}>
            <Formik
              initialValues={initialValues}
              validationSchema={addEditOperateDriver(t)}
              onSubmit={onSubmit}
            >
              {(formik) => {
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Row>
                          <Input
                            placeholder={t("first_name_key")}
                            label={t("first_name_key")}
                            name="FirstName"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("last_name_key")}
                            label={t("last_name_key")}
                            name="LastName"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("date_of_birth")}
                            label={t("date_of_birth")}
                            name="DateOfBirth"
                            type="date"
                            min="1900-01-01"
                            max={`${maxLicenceBirthDate}`}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            label={t("nationality_key")}
                            placeholder={t("nationality_key")}
                            type="text"
                            name="Nationality"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("phone_number_key")}
                            label={t("phone_number_key")}
                            name="PhoneNumber"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            min={0}
                          />

                          <Input
                            label={t("email_address_key")}
                            placeholder={t("email_address_key")}
                            name="Email"
                            type="email"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("license_number_key")}
                            label={t("license_number_key")}
                            name="DLNumber"
                            type="number"
                            min={0}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("license_expiration_date_key")}
                            label={t("license_expiration_date_key")}
                            name="DLExpirationDate"
                            type="date"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            min={`${minLicenceExDate}`}
                          />

                          <Input
                            placeholder={t("department_key")}
                            label={t("department_key")}
                            name="Department"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("RFID_key")}
                            label={t("RFID_key")}
                            name="RFID"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Form.Group
                            controlId="formFile"
                            className="col-12 col-md-6 col-lg-4 mb-3"
                          >
                            <Form.Label>{t("upload_image_key")}</Form.Label>
                            <Form.Control
                              className="border-primary"
                              type="file"
                              name="Image"
                              onChange={(event) => {
                                formik.setFieldValue(
                                  "Image",
                                  event.currentTarget.files[0]
                                );
                              }}
                            />
                          </Form.Group>

                          <Input
                            placeholder={t("selected_vehicle_plate_number_key")}
                            label={t("selected_vehicle_plate_number_key")}
                            name="SelectedVehiclePlateNumber"
                            type="text"
                            disabled={true}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <h4>{t("WASL_Integration_(Optional)_key")}</h4>
                          <Input
                            placeholder={t("identity_number_key")}
                            label={t("identity_number_key")}
                            name="IdentityNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("date_of_birth_hijri_key")}
                            label={t("date_of_birth_hijri_key")}
                            name="DateOfBirthHijri"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("mobile_number_key")}
                            label={t("mobile_number_key")}
                            name="MobileNumber"
                            type="number"
                            min={0}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                        {model && (
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
                          {t("save_key")}
                        </Button>
                        <Button
                          className="px-3 py-2 text-nowrap me-3 ms-0"
                          onClick={() => {
                            if (model) {
                              handleModel();
                            } else {
                              router.push("/drivers-management");
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
}
