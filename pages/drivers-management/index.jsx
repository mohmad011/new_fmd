import React, { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Card, Button } from "react-bootstrap";
import DeleteModal from "components/UI/DeleteModal";
import Link from "next/link";
import { toast } from "react-toastify";
import HideActions from "hooks/HideActions";
import AgGridDT from "components/AgGridDT";
import { fetchAllDrivers, deleteDriver } from "services/driversManagement";
import Model from "components/UI/Model";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Edit from "components/driversManagement/Edit";
import { useRouter } from "next/router";

function DriversManagement() {
  const router = useRouter();
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState();
  const [Driver, setDriver] = useState({});
  const { t } = useTranslation("driversManagement");
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [DataTable, setDataTable] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editID, setEditID] = useState("");

  // fecth all drivers and set the Api of the AG grid table for export pdf
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllDrivers();
      setDataTable(respond?.drivers);
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // delete driver
  const onDelete = async () => {
    setloadingDelete(true);
    try {
      await deleteDriver(Driver.DriverID);
      toast.success(Driver.FirstName + `${t("deleted_successfully_key")}`);
      setDataTable((prev) =>
        prev.filter((diver) => diver.DriverID !== Driver.DriverID)
      );
      setloadingDelete(false);
      setshowModalDelete(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  // display full name that came from http reqeust
  const handleFullName = (params) => {
    return `${params.data.FirstName} ${params.data.LastName}`;
  };

  //the setting of the AG grid table .. sort , filter , etc...
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
        headerName: `${t("full_name_key")}`,
        field: "FirstName",
        valueGetter: handleFullName,
        cellRenderer: (params) => (
          <>
            <Link
              href={{
                pathname: `/driver/[driverId]`,
                query: { driverId: params.data.DriverID },
              }}
              passHref
            >
              {params.value}
            </Link>
            <div className="d-flex justify-content-start gap-1 options flex-wrap">
              <Link
                href={`/drivers-management/showVehicles/${params.data.DriverID}`}
                passHref
              >
                <span style={{ fontSize: "13px" }}>{t("vehicles_key")} |</span>
              </Link>
              <span
                onClick={() => {
                  setEditID(params.data.DriverID);
                  setModalShow(true);
                }}
                style={{ fontSize: "13px" }}
              >
                {t("edit_key")} |
              </span>
              <span
                style={{ fontSize: "13px" }}
                onClick={() => {
                  setshowModalDelete(true);
                  setDriver(params.data);
                }}
                className=""
              >
                {t("delete_key")}
              </span>
            </div>
          </>
        ),
        minWidth: 190,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("phone_number_key")}`,
        field: "PhoneNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("email_key")}`,
        field: "Email",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("department_key")}`,
        field: "Department",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("license_number_key")}`,
        field: "DLNumber",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("license_expiration_date_key")}`,
        field: "DLExpirationDate",
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: `${t("RFID_key")}`,
        field: "RFID",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("wasl_integration_key")}`,
        field: "AssignedVehiclesCount",
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
              <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
                <div className="d-flex justify-content-center flex-wrap mb-4">
                  <Link href="drivers-management/add">
                    <a>
                      <Button
                        variant="primary p-2"
                        className="mb-2 mb-md-0"
                        style={{ fontSize: "13px" }}
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faCog}
                          size="sm"
                        />
                        {t("add_new_driver_key")}
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>

              <AgGridDT
                enableRtl={localStorage?.language === "ar"}
                rowHeight={65}
                columnDefs={columns}
                rowData={DataTable}
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
        confirmText={t("yes,_delete_key")}
        title={t("delete_driver_key")}
        description={t("are_you_sure_you_want_to_delete_this_driver?")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
          setDriver({});
        }}
      />
      <Model
        header={t("update_driver_key")}
        show={modalShow}
        onHide={() => setModalShow(false)}
        updateButton={t("update_key")}
        footer={false}
      >
        <Edit
          handleModel={() => {
            setModalShow(false);
          }}
          icon={faExternalLinkAlt}
          model={true}
          id={editID}
          modelButtonMsg={t("open_in_new_tab_key")}
          className={`p-0 m-0`}
          onModelButtonClicked={() => {
            router.push(`/drivers-management/edit/${editID}`);
          }}
          updateTable={onGridReady}
        />
      </Model>
    </div>
  );
}

export default DriversManagement;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["driversManagement", "main",])),
    },
  };
}
// translation ##################################
