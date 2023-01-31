import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { AddSimValidation } from "helpers/yup-validations/management/sim-management";
import { updateSim } from "services/management/SimManagement";
import { useTranslation } from "next-i18next";

const EditSim = ({
  editObj,
  updateAssignedTable,
  updateUnassignedTable,
  handleModel,
}) => {
  const [loading, setLoading] = useState(false);
  const { ID: id, PhoneNumber, SimSerialNumber, ProviderID } = editObj;
  const { t } = useTranslation("management");

  // options for sim provider for react select
  const simProviderOptions = [
    { value: 1, label: t("mobily_key") },
    { value: 2, label: t("STC_key") },
    { value: 3, label: t("zain_key") },
    { value: 4, label: t("lebara_key") },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const respond = await updateSim(id, data);
      setLoading(false);
      toast.success(respond.message);
      handleModel();
      updateAssignedTable();
      updateUnassignedTable();
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const initialValues = {
    SimSerialNumber: SimSerialNumber,
    PhoneNumber: PhoneNumber,
    ProviderID: ProviderID,
  };

  return (
    <div className="container-fluid">
      <Card>
        <Card.Body className="p-0 m-0">
          <Formik
            initialValues={initialValues}
            validationSchema={AddSimValidation(t)}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col className="mx-auto" md={10}>
                      <Row>
                        <h4 className="mb-3">{t("edit_SIM_card_key")}</h4>
                        <Input
                          placeholder={t("serial_number_key")}
                          label={t("serial_number_key")}
                          name="SimSerialNumber"
                          type="text"
                          className={"col-6 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />

                        <Input
                          placeholder={t("phone_number_key")}
                          label={t("phone_number_key")}
                          name="PhoneNumber"
                          type="number"
                          min={0}
                          className={"col-6 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />

                        <ReactSelect
                          options={simProviderOptions}
                          label={t("SIM_provider_key")}
                          placeholder={t("select_SIM_provider_key")}
                          name="ProviderID"
                          className={"col-12 mb-3"}
                          isSearchable={true}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mx-auto" md={10}>
                      <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                        <Button
                          type="submit"
                          className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                          disabled={loading}
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
                            handleModel()
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
    </div>
  );
};

export default EditSim;
