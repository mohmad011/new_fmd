import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import UseTableColumns from "../../hooks/UseTableColumns";
import AgGridDT from "../AgGridDT";

const TableTaps = ({
  reportTabs,
  handleTap,
  config,
  handleCloseTab,
  style,
  reportsTitleSelectedId,
  reportsDataSelected,
  Data_table,
  msgTable,
  reportsTitleSelected,
}) => {
  const { t } = useTranslation(["reports", "main", "Table"]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [listDCurr, setListDCurr] = useState([]);

  const {
    columns1,
    columns2,
    columns3,
    columns4,
    columns5,
    columns6,
    columns7,
    columns8,
    columns9,
    columns10,
    columns11,
    columns12,
    columns13,
    columns14,
    columns15,
    columns16,
    columns17,
    columns18,
    columns19,
    columns20,
    columns21,
    columns22,
  } = UseTableColumns();

  useEffect(() => {
    setListDCurr([]);
    switch (t(reportsTitleSelected)) {
      case t("Working_Hours_and_Mileage_Daily_Basis"):
        setListDCurr(columns1);
        break;
      case t("Working_Hours_and_Mileage_Period"):
        setListDCurr(columns2);
        break;
      case t("Custom_Running_Time"):
        setListDCurr(columns3);
        break;
      case t("Trip_Report"):
        setListDCurr(columns4);
        break;
      case t("Fuel_Summary_Report"):
        setListDCurr(columns5);
        break;
      case t("Driver_Logging"):
        setListDCurr(columns6);
        break;
      case t("Driving_Statistics_Per_Period"):
        setListDCurr(columns7);
        break;
      case t("Zone_Activity"):
        setListDCurr(columns8);
        break;
      case t("Geofences_Log"):
        // here
        setListDCurr(columns9);
        break;
      case t("Zones_Summary_Activities"):
        setListDCurr(columns10);
        break;
      case t("Zones_Summary_Activities_Daily"):
        setListDCurr(columns11);
        break;
      case t("In_Zone_Details"):
        setListDCurr(columns12);
        break;
      case t("In_Zone_Summary"):
        setListDCurr(columns13);
        break;
      case t("Weight_Statistics_Report"):
        setListDCurr(columns14);
        break;
      case t("Weight_Detailed_Report"):
        setListDCurr(columns15);
        break;
      case t("Temperature_Summary_Report"):
        setListDCurr(columns16);
        break;
      case t("Temperature_Detailed_Report"):
        setListDCurr(columns17);
        break;
      case t("Speed_Over_Duration_Report"):
        setListDCurr(columns18);
        break;
      case t("Over_Speed_Report"):
        setListDCurr(columns19);
        break;
      case t("Offline_Vehicles_Report"):
        setListDCurr(columns20);
        break;
      case t("User_Vehicles"):
        setListDCurr(columns21);
        break;
      case t("Vehicle_Idling_and_Parking_Reports"):
        setListDCurr(columns22);
        break;
      default:
        console.log("no data");
    }
  }, [reportsTitleSelectedId]);

  const rowHeight = "auto";

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }, []);

  // Start AG grid Settings
  const columns = useMemo(
    () => listDCurr,
    [t, reportsDataSelected, Data_table, listDCurr]
  );

  //set the Api of the AG grid table
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  //first page to render in the AG grid table
  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(0);
  };

  const handleSelectTabs = (id) =>
    reportsTitleSelectedId === id ? "active" : "";

  const handleSelectContentTabs = (id) =>
    reportsTitleSelectedId === id ? "show active" : "";

  return (
    <Row>
      <Col sm="12">
        <Card>
          <Card.Body>
            <ul
              className="nav nav-tabs bg-transparent"
              id="myTab"
              role="tablist"
            >
              <div
                className="d-flex horizontal-scrollable w-100"
                style={{
                  overflowX: "auto",
                  whiteSpace: reportTabs.length > 0 ? "nowrap" : "normal",
                }}
              >
                {reportTabs.length > 0 &&
                  reportTabs?.map((item, key) => (
                    <li
                      className={`nav-item btn-light report_tab p-2 ${handleSelectTabs(
                        item[0]
                      )} `}
                      role="presentation"
                      key={key}
                    >
                      <button
                        className="nav-link bg-transparent text-primary btnLink  rounded-0 position-relative p-0 ps-2 pe-4"
                        id={`data-${item[0]}`}
                        data-bs-toggle="tab"
                        data-bs-target={`#data-${item[0]}`}
                        type="button"
                        role="tab"
                        onClick={() => handleTap(item[1], item[0])}
                      >
                        <span
                          dir={config.language === "ar" ? "rtl" : "ltr"}
                          className="report_name"
                        >
                          {item[1]}
                        </span>
                        <div
                          onClick={(e) => handleCloseTab(e, item[0])}
                          className={`${style.closeTab} ${style.active}`}
                        >
                          <span
                            className={`${style.closeTab__patty} bg-primary`}
                          />
                          <span
                            className={`${style.closeTab__patty} bg-primary`}
                          />
                          <span
                            className={`${style.closeTab__patty} bg-primary`}
                          />
                        </div>
                      </button>
                    </li>
                  ))}
              </div>
            </ul>

            <div className="tab-content" id="myTabContent">
              {reportTabs.length > 0 &&
                reportTabs?.map((item, key) => (
                  <>
                    {item[1] === reportsTitleSelected && (
                      <div
                        key={key}
                        className={`tab-pane fade ${handleSelectContentTabs(
                          item[0]
                        )}`}
                        id={`data-${item[0]}`}
                        role="tabpanel"
                      >
                        <AgGridDT
                          rowHeight={rowHeight}
                          columnDefs={columns}
                          rowData={reportsDataSelected && reportsDataSelected}
                          paginationNumberFormatter={function (params) {
                            return params.value.toLocaleString();
                          }}
                          onFirstDataRendered={onFirstDataRendered}
                          defaultColDef={defaultColDef}
                          onGridReady={onGridReady}
                          overlayNoRowsTemplate={msgTable && msgTable}
                          suppressMenuHide={true}
                          gridApi={gridApi}
                          gridColumnApi={gridColumnApi}
                        />
                      </div>
                    )}
                  </>
                ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TableTaps;
