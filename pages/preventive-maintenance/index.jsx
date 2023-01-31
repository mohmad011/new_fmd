import React, { useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHistory, faPlus } from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Button, Card } from "react-bootstrap";
import {
  fetchAllPreventiveMaintenance,
  deletePreventive,
} from "services/preventiveMaintenance";
import Link from "next/link";
import DeleteModal from "components/UI/DeleteModal";
import { toast } from "react-toastify";
import HideActions from "hooks/HideActions";
import AgGridDT from "components/AgGridDT";
import { useRouter } from "next/router";
import Model from "components/UI/Model";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Edit from "components/preventiveMaintenance/Edit";
import Reset from "components/preventiveMaintenance/Reset";

function PreventiveMaintenance() {
  const router = useRouter();
  const { t } = useTranslation("preventiveMaintenance");
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowsSelected, setrowsSelected] = useState([]);
  const [DataTable, setDataTable] = useState(null);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState();
  const [editModalShow, setEditModalShow] = useState(false);
  const [editID, setEditID] = useState("");
  const [resetModalShow, setResetModalShow] = useState(false);
  const [resetPreventive, setResetPreventive] = useState({});

  // fecth all preventive maintenance and set the Api of the AG grid table for export pdf
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllPreventiveMaintenance();
      setDataTable(respond.result);
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }, []);

  // delete selected data
  const deleteSelectedDate = rowsSelected?.map((row) => row.ID);
  const deleteSelectedDateString = deleteSelectedDate.toString();
  const deleteSelectedNameseString = rowsSelected
    ?.map((row) => row.DisplayName)
    .toString();

  const onDeleteSelected = async () => {
    setshowModalDelete(true);
  };

  const onDelete = async () => {
    setloadingDelete(true);
    try {
      await deletePreventive(deleteSelectedDateString);
      toast.success(deleteSelectedNameseString + t("deleted_successfully_key"));
      setDataTable(
        DataTable?.filter((driver) => !deleteSelectedDate.includes(driver.ID))
      );
      setrowsSelected([]);
      setloadingDelete(false);
      setshowModalDelete(false);
    } catch (error) {
      toast.error(error.response.data?.message);
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  // change the value of MaintenanceType that came from http reqeust to its name
  const handleMaintenanceType = (params) => {
    const allData = {
      1: "Engine Oil Change",
      2: "Change Vehicle Brakes",
      3: "Vehicle License Renew",
      4: "Vehicle Wash",
      5: "Tires Change",
      6: "Transmission Oil Change",
      7: "Filter Change",
      8: "Others",
    };
    return allData[params?.data?.MaintenanceType];
  };

  // change the value of PeriodType that came from http reqeust to its name
  const handlePeriodType = (params) => {
    const allData = {
      1: "By Mileage",
      2: "By Fixed Date",
      4: "By Working Hours",
    };
    return allData[params.data.PeriodType];
  };

  // change the value of Recurring that came from http reqeust to true/false
  const handleRecurring = (params) => {
    return params.data.Recurring ? "true" : "false";
  };

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  // columns used in ag grid
  const columns = useMemo(
    () => [
      {
        headerName: "",
        field: "Select",
        maxWidth: 70,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: t("display_name_key"),
        field: "DisplayName",
        minWidth: 200,
        maxWidth: 300,
        sortable: true,
        unSortIcon: true,
        cellRenderer: (params) => {
          const resetData = {
            plateNumber: params.data.PlateNumber,
            maintenanceType: params.data.MaintenanceType,
            periodType: params.data.PeriodType,
            startValue: params.data.StartValue,
            nextValue: params.data.NextValue,
          };
          return (
            <>
              <div>{params.value}</div>
              <div className="d-flex justify-content-start gap-1 options flex-wrap">
                <span
                  onClick={() => {
                    setResetModalShow(true);
                    setResetPreventive(resetData);
                  }}
                >
                  {t("reset_key")} |
                </span>
                <span
                  onClick={() => {
                    setEditModalShow(true);
                    setEditID(params.data.ID);
                  }}
                  className=""
                >
                  {t("edit_key")}
                </span>
                <span
                  onClick={() => {
                    setshowModalDelete(true);
                  }}
                  className=""
                >
                  | {t("delete_key")}
                </span>
              </div>
            </>
          );
        },
      },
      {
        headerName: t("plate_number_key"),
        field: "PlateNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("maintenance_key"),
        field: "MaintenanceType",
        valueGetter: handleMaintenanceType,
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("period_type_key"),
        field: "PeriodType",
        valueGetter: handlePeriodType,
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("start_value_key"),
        field: "StartValue",
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: t("next_value_key"),
        field: "NextValue",
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: t("recurring_key"),
        field: "Recurring",
        valueGetter: handleRecurring,
        minWidth: 120,
        unSortIcon: true,
      },
    ],
    [t]
  );

  return (
    <div className="container-fluid">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-start justify-content-md-center justify-content-md-between flex-wrap">
                <div className="d-flex flex-column flex-md-row justify-content-center flex-wrap mb-4">
                  <Button
                    variant="primary p-1 d-flex align-items-center"
                    className="m-1"
                    style={{ fontSize: "13px" }}
                    onClick={() => router.push("/preventive-maintenance/add")}
                  >
                    <FontAwesomeIcon className="me-2" icon={faPlus} size="sm" />
                    {t("add_maintenance_plan_key")}
                  </Button>

                  <Button
                    disabled={!rowsSelected.length}
                    variant="primary p-1 d-flex align-items-center"
                    className="m-1"
                    style={{ fontSize: "13px" }}
                    onClick={onDeleteSelected}
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faTrash}
                      size="sm"
                    />
                    {t("delete_selected_key")}
                  </Button>
                  <Button
                    variant="primary p-1 d-flex align-items-center"
                    className="m-1"
                    style={{ fontSize: "13px" }}
                    onClick={() =>
                      router.push("/preventive-maintenance/view-history")
                    }
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faHistory}
                      size="sm"
                    />
                    {t("view_history_key")}
                  </Button>
                </div>
              </div>

              <AgGridDT
                rowHeight={65}
                columnDefs={columns}
                rowData={DataTable}
                rowSelection={"multiple"}
                onSelectionChanged={(e) =>
                  setrowsSelected([...e.api.getSelectedRows()])
                }
                onCellMouseOver={(e) =>
                  (e.event.path[1].dataset.test = "showActions")
                }
                onCellMouseOut={HideActions}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        title={t("delete_maintenance_plan_key")}
        description={
          deleteSelectedDate.length === 1
            ? t("are_you_sure_you_want_to_delete_this_maintenance_plan?")
            : t("are_you_sure_you_want_to_delete_the_maintenance_plans?")
        }
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
        }}
      />
      {/* Edit Model */}
      <Model
        header={t("update_maintenance_plan_key")}
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        updateButton={"Update"}
        footer={false}
      >
        <Edit
          handleModel={() => {
            setEditModalShow(false);
          }}
          icon={faExternalLinkAlt}
          model={true}
          id={editID}
          // modelButtonMsg={""}
          className={`p-0 m-0`}
          onModelButtonClicked={() => {
            router.push(`/preventive-maintenance/edit/${editID}`);
          }}
          updateTable={onGridReady}
        />
      </Model>
      {/* Reset Model */}
      <Model
        header={t("reset_notification's_value_key")}
        show={resetModalShow}
        onHide={() => setResetModalShow(false)}
        updateButton={"Submit"}
        footer={false}
      >
        <Reset
          data={resetPreventive}
          handleModel={() => {
            setResetModalShow(false);
          }}
        />
      </Model>
    </div>
  );
}

export default PreventiveMaintenance;

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
