import { useState } from "react";
import { Button, Col, Form, FormControl, Modal, Row } from "react-bootstrap";
import style from "styles/ReportsOptions.module.scss";
import Input from "components/formik/Input";

// import MenuTreeReports from "./MenuTreeReports";
// import { DateRangePicker, DatePicker } from "rsuite";
import { useTranslation } from "next-i18next";
// import UseDarkmode from "../../hooks/UseDarkmode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { CustomInput } from "components/CustomInput";
import { Datepicker, DatepickerMulti } from "components/datepicker";
import Third from "components/datepicker/Third";

// const { afterToday } = DateRangePicker;

const ReportsOptions = (props) => {
  const { t } = useTranslation("reports");
  const [treeFilter, setTreeFilter] = useState("");
  const { darkMode } = useSelector((state) => state.config);

  const handleDate1 = (e) => {
    console.log(e);
    // const dateformat = e.toString().split("GMT");
    // const endFormat = [dateFormat(dateformat[0], "isoDateTime").split("+")[0]];

    // props.setReportDateOptions({
    //   recordDate1: endFormat,
    //   recordDate2: props.reportDateOptions.recordDate2,
    //   recordDate3: props.reportDateOptions.recordDate2,
    // });
  };

  const handleDate2 = (e) => {
    console.log(e);
    // const dateformat = e?.map((x) => x.toString().split(" GMT")[0]);
    // const updateFormat = dateformat?.map((x) => dateFormat(x, "isoDateTime"));
    // const endFormat = updateFormat?.map((x) => x.split("+")[0]);

    // props.setReportDateOptions({
    //   recordDate1: props.reportDateOptions.recordDate1,
    //   recordDate2: endFormat[0],
    //   recordDate3: endFormat[1],
    // });
  };

  const handleFuelData = (e) => {
    props.setFuelData(e.target.value);
  };

  const handleOverSpeed = (e) => {
    props.setOverSpeed(e.target.value);
  };

  const handleMinimumSpeed = (e) => {
    props.setMinimumSpeed(e.target.value);
  };

  const handleSpeedDurationOver = (e) => {
    props.setSpeedDurationOver(e.target.value);
  };

  const handleFilter = (e) => {
    setTreeFilter(e.target.value.toLocaleLowerCase());
  };

  const handleDurationTripReport = (e) => {
    props.setTripDuration(e.target.value);
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        style={{
          background: darkMode ? "#222738" : "#FFFFFF",
          borderBottomColor: darkMode ? "#151824" : "#DDD",
        }}
      >
        <div
          className={`d-flex justify-content-center align-items-center ${style.bxTitleIcon}`}
        >
          <span>
            <FontAwesomeIcon
              icon={faFileAlt}
              className={`${style.icon} text-${darkMode ? "light" : "primary"}`}
            />
          </span>
          <span className="text-center fs-6 w-50">{t(props.reportName)}</span>
        </div>
      </Modal.Header>

      <Modal.Body style={{ background: darkMode ? "#222738" : "#FFFFFF" }}>
        <Row>
          {/* =====| select date |===== */}
          <Col md="12">
            {props.dateStatus === "two" ? (
              <>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>{t("Select_Date_Range")}</Form.Label>
                  <DatepickerMulti handleDate={handleDate2} t={t} className={darkMode ? "bg-transparent text-white border-primary" : ""} />

                </Form.Group>
              </>
            ) : props.dateStatus === "one" ? (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>{t("Select_Date")}</Form.Label>
                <Datepicker handleDate={handleDate1} t={t} className={darkMode ? "bg-transparent text-white border-primary" : ""} />


              </Form.Group>
            ) : null}
          </Col>

          {/* =====| select date |===== */}
          {t(props.reportName) === t("Fuel_Summary_Report") && (
            <Input
              label={t("Fuel_Price_(RS)")}
              placeholder={t("Fuel_Price_(RS)")}
              type="number"
              className={"col-md-6"}
              onChange={handleFuelData}

            />
          )}

          {/* =====| select date |===== */}

          {t(props.reportName) === t("Over_Speed_Report_key") && (
            <Input
              label={t("Minimum_Speed_(KM/H)")}
              placeholder={t("Minimum_Speed_(KM/H)")}
              type="number"
              className={"col-md-6"}
              onChange={handleOverSpeed}
            />
          )}

          {t(props.reportName) === "Speed Over Duration Report" && (
            <>

              <CustomInput
                label={t("Minimum Speed (KM/H)")}
                placeholder={t("Minimum Speed (KM/H)")}
                type="number"
                className={"col-md-6"}
                onChange={handleMinimumSpeed}
              />
              <CustomInput
                label={t("Duration (Seconds)")}
                placeholder={t("Duration (Seconds)")}
                type="number"
                className={"col-md-6"}
                onChange={handleSpeedDurationOver}
              />
            </>
          )}


          {props.dateStatus && (
            <CustomInput
              label={t("Enter_Serial_Number")}
              placeholder={t("Enter_Serial_Number")}
              type="number"
              className={"col-md-6"}
              onChange={handleFilter}
            />
          )}

          {t(props.reportName) === "Trip Report" && (
            <CustomInput
              label={t("Duration (Seconds)")}
              placeholder={t("Duration (Seconds)")}
              type="text"
              className={"col-md-6"}
              onChange={handleDurationTripReport}
            />

          )}

          {props.dateStatus !== "two" && props.dateStatus !== "one" ? (
            <div className=" d-flex align-items-center">
              <span className={` d-block mt-4 mb-4`}>
                {/* {t("Select_Vichales")} */}
                Select Vehicles
              </span>
              <FormControl
                type="text"
                className={` ${style.Search} ms-3 bg-transparent`}
                placeholder={t("Enter_Serial_Number")}
                onChange={handleFilter}
              />
            </div>
          ) : (
            <span className={`text-secondary d-block mt-4 mb-4`}>
              {/* {t("Select_Vichales")} */}
              Select Vehicles
            </span>
          )}
          {props.vehiclesError && (
            <span className="text-danger fs-6">{props.vehiclesError}</span>
          )}
          {/* <MenuTreeReports
            setVehiclesError={props.setVehiclesError}
            treeFilter={treeFilter}
          /> */}
        </Row>
      </Modal.Body>
      <Modal.Footer
        style={{
          background: darkMode ? "#222738" : "#FFFFFF",
          borderTopColor: darkMode ? "#151824" : "#DDD",
        }}
      >
        <Button
          className="my-0 mx-auto  py-2 px-5"
          onClick={() => props.ShowReports("Show", props.reportName)}
          disabled={props.loadingShowReport}
        >
          {props.loadingShowReport ? t("Loading") : t("Show_Reports")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportsOptions;
