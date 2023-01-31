import React, { useState } from "react";
import { Formik } from "formik";
import { Row, Button, Form } from "react-bootstrap";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportToCsv } from "helpers/helpers";
import * as Yup from "yup";
import FileInput from "components/formik/FileInput";
import { useTranslation } from "next-i18next";

const Bulk = ({
  handleModel,
  modelButtonMsg,
  icon,
  excelData,
  fileName,
  bulkRequest,
  loading,
}) => {
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useTranslation("management");
  const initialValues = {
    excel: "",
  };

  const onSubmit = (data) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", data.excel);
    bulkRequest(bodyFormData);
  };

  const yupValidation = Yup.object().shape({
    excel: Yup.string().required(t(`file_is_required_key`)).trim(),
  });

  const errorFormData = (errors) => {
    setErrorMsg(errors.excel);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupValidation}
      onSubmit={onSubmit}
    >
      {(formik) => {
        setTimeout(() => errorFormData(formik.errors), 0);
        return (
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <FileInput
                name="excel"
                label={`${t("select_file_key")}:`}
                className={"col-12 col-md-6 col-lg-4 mb-3"}
                onChange={(event) => {
                  formik.setFieldValue("excel", event.currentTarget.files[0]);
                }}
                errorMsg={errorMsg}
              />
            </Row>
            <div className="w-25 d-flex flex-wrap flex-md-nowrap">
              <Button
                className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
                type="button"
                onClick={() => {
                  exportToCsv(`${fileName}.csv`, excelData);
                }}
              >
                {modelButtonMsg}
                {<FontAwesomeIcon className="mx-2" icon={icon} size="sm" />}
              </Button>
              <Button
                type="submit"
                disabled={!formik.isValid || loading}
                className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
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
                {t("add_bulk_key")}
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
  );
};

export default Bulk;
