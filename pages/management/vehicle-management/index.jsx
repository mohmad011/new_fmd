import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUsersCog,
  faExternalLinkAlt,
  faPlug,
  faSimCard,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import CardCountStart from "components/CardCountStart";
import {
  fetchVehilceStatistics,
  fetchAllVehicles,
  fetchAllUnAssignedVehicles,
  deleteVehicle,
  postVehiclesBulk,
} from "services/management/VehicleManagement";
import Edit from "components/management/VehicleManagement/Edit";
import Bulk from "components/management/Bulk";
import AssignDevice from "components/management/VehicleManagement/AssignDevice";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Card, Button } from "react-bootstrap";
import DeleteModal from "components/UI/DeleteModal";
import Link from "next/link";
import HideActions from "hooks/HideActions";
import AgGridDT from "components/AgGridDT";
import WaslIntegration from "components/icons/management/WaslIntegrationIcon";
import { toast } from "react-toastify";
import router from "next/router";
import Model from "components/UI/Model";

// data for download bulk
const excelData = [
  {
    PlateNumber: "",
    DisplayName: "",
    SerialNumber: "",
    DeviceType: "",
    MakeYear: "",
    PhoneNumber: "",
    SimProvider: "",
    SIMSerial: "",
    GroupName: "",
    Remarks: "",
    AccountName: "",
    SpeedLimit: "",
    MaxTemp: "",
    MinTemp: "",
    Number: "",
    LeftLetter: "",
    MiddleLetter: "",
    RightLetter: "",
    SequenceNumber: "",
    PlateType: "",
    HeadWeight: "",
    TailWeight: "",
    CargoWeight: "",
    MaximumVoltage: "",
    MinimumVoltage: "",
    FirstName: "",
    LastName: "",
    IdentityNumber: "",
    DateOfBirthHijri: "",
    MobileNumber: "",
    HaveRelay: "",
    HaveIgnition: "",
  },
];

function VehicleManagment() {
  const { t } = useTranslation("management");
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);

  const [vehiclesStatistics, setVehiclesStatistics] = useState({});
  const [assignedVehicles, setAssignedVehicles] = useState(null);
  const [assignedGridApi, setAssignedGridApi] = useState(null);
  const [assignedGridColumnApi, setAssignedGridColumnApi] = useState(null);

  const [unassignedVehicles, setUnassignedVehicles] = useState(null);
  const [unassignedGridApi, setUnassignedGridApi] = useState(null);
  const [unassignedGridColumnApi, setUnassignedGridColumnApi] = useState(null);
  const [deleteObj, setDeleteObj] = useState({});
  const [editID, setEditID] = useState("");
  const [assignVehicleID, setAssignVehicleID] = useState("");
  const [editModalShow, setEditModalShow] = useState(false);
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [bulkModel, setBulkModel] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // fetch vehicle Statistics(main page)
  useEffect(() => {
    const fetchVehiclesStatistics = async () => {
      try {
        const respond = await fetchVehilceStatistics();
        setVehiclesStatistics(respond);
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    };
    fetchVehiclesStatistics();
  }, []);

  //fetch Assigned vehicles data
  const onAssigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllVehicles();
      setAssignedVehicles(respond.Vehicles);
      setAssignedGridApi(params.api);
      setAssignedGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  //fetch unassigned vehicles data
  const onUnassigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllUnAssignedVehicles();
      setUnassignedVehicles(respond.unAssingedVehs);
      setUnassignedGridApi(params.api);
      setUnassignedGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // delete vehicle
  const onDelete = async () => {
    setloadingDelete(true);

    try {
      const respond = await deleteVehicle(deleteObj.id);
      toast.success(respond.message);
      setloadingDelete(false);
      setshowModalDelete(false);
      if (deleteObj.isAssignTable) {
        setAssignedVehicles((prev) =>
          prev.filter((ele) => ele.VehicleID !== deleteObj.id)
        );
      } else {
        setUnassignedVehicles((prev) =>
          prev.filter((ele) => ele.VehicleID !== deleteObj.id)
        );
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  // bulk submited function
  const bulkDataHandler = async (data) => {
    setBulkLoading(true);
    try {
      const respond = await postVehiclesBulk(data);
      setBulkLoading(false);
      setBulkModel(false);
      toast.success("Bulk added successfully");
    } catch (error) {
      toast.error(error.response.data?.message);
      setBulkLoading(false);
    }
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

  // columns used in assigned ag grid
  const columnsAssigned = useMemo(
    () => [
      {
        headerName: `${t("display_name_key")}`,
        field: "DisplayName",
        cellRenderer: (params) => (
          <>
            <Link
              href={{
                pathname: `/vehicle/[vehicleId]`,
                query: { vehicleId: params.data.VehicleID },
              }}
              passHref
            >
              {params.value}
            </Link>
            <div className="d-flex justify-content-start gap-1 options flex-wrap">
              {/* <span
                onClick={() => {
                  console.log("abdo");
                }}
              >
                {t("Accessories")} |
              </span> */}
              <span
                onClick={() => {
                  setEditID(params.data.VehicleID);
                  setEditModalShow(true);
                }}
                className=""
              >
                {t("edit_key")}
              </span>
              <span
                onClick={() => {
                  setshowModalDelete(true);
                  setDeleteObj({
                    id: params.data.VehicleID,
                    isAssignTable: true,
                  });
                }}
                className=""
              >
                | {t("delete_key")}
              </span>
            </div>
          </>
        ),
        minWidth: 200,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("plate_number_key")}`,
        field: "PlateNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("manufacturing_company_key")}`,
        field: "manufacturingCompany",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("vehicle_type_key")}`,
        field: "TypeName",
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("chassis_number_key")}`,
        field: "Chassis",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("manufacturing_year_key")}`,
        field: "MakeYear",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("device_serial_number_key")}`,
        field: "SerialNumber",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("device_type_key")}`,
        field: "DeviceType",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("WASL_integration_key")}`,
        field: "WASLIntegration",
        minWidth: 300,
        unSortIcon: true,
      },
    ],
    [t]
  );

  // columns used in unassigned ag grid
  const columnsUnAssigned = useMemo(
    () => [
      {
        headerName: `${t("display_name_key")}`,
        field: "DisplayName",
        cellRenderer: (params) => (
          <>
            <div>{params.value}</div>
            <div className="d-flex justify-content-start gap-1 options flex-wrap">
              <span
                onClick={() => {
                  setAssignModalShow(true);
                  setAssignVehicleID(params.data.VehicleID);
                }}
              >
                {t("assign_device_key")} |
              </span>
              <span
                onClick={() => {
                  setEditID(params.data.VehicleID);
                  setEditModalShow(true);
                }}
                className=""
              >
                {t("edit_key")}
              </span>
              <span
                onClick={() => {
                  setshowModalDelete(true);
                  setDeleteObj({
                    id: params.data.VehicleID,
                    isAssignTable: false,
                  });
                }}
                className=""
              >
                | {t("delete_key")}
              </span>
            </div>
          </>
        ),
      },
      {
        headerName: `${t("plate_number_key")}`,
        field: "PlateNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("manufacturing_company_key")}`,
        field: "manufacturingCompany",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("vehicle_type_key")}`,
        field: "TypeName",
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("chassis_number_key")}`,
        field: "Chassis",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("manufacturing_year_key")}`,
        field: "MakeYear",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
        valueFormatter: function (params) {
          return params.value.slice(0, 4);
        },
      },
    ],
    [t]
  );

  return (
    <div className="container-fluid">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header>
              <Row>
                <CardCountStart
                  icon={faCar}
                  iconColor="primary"
                  title={t("active_vehicles_key")}
                  countEnd={vehiclesStatistics.active_Vehicles}
                  desc= {t("vehicles_that_is_currently_live_and_send_data_key")}
                />
                <CardCountStart
                  icon={faPlug}
                  iconColor="success"
                  title={t("inactive_vehicles_key")}
                  countEnd={vehiclesStatistics.Inactive_Vehicles}
                  desc= {t("vehicles_that_didn't_send_any_data_for_more_than_one_minute_key")}
                />
                <CardCountStart
                  icon={faUsersCog}
                  iconColor="warning"
                  title={t("unassigned_devices_key")}
                  countEnd={vehiclesStatistics.unassignedDevices}
                  desc= {t("devices_that_are_added_to_the_system_but_not_yet_assigned_to_a_vehicle_key")}
                />
                <CardCountStart
                  iconColor="info"
                  title={t("registered_vehicle_to_WASL_key")}
                  countEnd={vehiclesStatistics.registerdtoWASL}
                  desc= {t("registered_vehicle_to_WASL_key")}
                >
                  <WaslIntegration width={"40px"} fill={"currentColor"} />
                </CardCountStart>
              </Row>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column w-100">
                <div className="w-100 header-title d-flex justify-content-between align-items-center py-3">
                  <div>
                    <Link href="/management/vehicle-management/add/vehicle-data">
                      <a>
                        <Button
                          type="button"
                          className="btn btn-primary  px-3 py-2 me-3 "
                        >
                          <FontAwesomeIcon
                            className="me-2"
                            icon={faSimCard}
                            size="sm"
                          />
                          {t("add_vehicle_key")}
                        </Button>
                      </a>
                    </Link>

                    <button
                      type="button"
                      className="btn btn-primary  px-3 py-2 me-3 "
                      onClick={() => {
                        setBulkModel(true);
                      }}
                    >
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faSimCard}
                        size="sm"
                      />
                      {t("add_vehicle_bulk_key")}
                    </button>
                    {/* <Link href="" passHref> */}
                    <button
                      type="button"
                      className="btn btn-primary  px-3 py-2 me-3 "
                      disabled
                    >
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faSimCard}
                        size="sm"
                      />
                      {t("transfer_device_to_account_key")}
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>

              <h3>{t("assigned_vehicles_key")}</h3>
              <AgGridDT
                columnDefs={columnsAssigned}
                rowData={assignedVehicles}
                onCellMouseOver={(e) =>
                  (e.event.path[1].dataset.test = "showActions")
                }
                onCellMouseOut={HideActions}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onAssigndGridReady}
                gridApi={assignedGridApi}
                gridColumnApi={assignedGridColumnApi}
              />

              <h3 className="mt-5">{t("unassigned_vehicles_key")}</h3>
              <AgGridDT
                columnDefs={columnsUnAssigned}
                rowData={unassignedVehicles}
                onCellMouseOver={(e) =>
                  (e.event.path[1].dataset.test = "showActions")
                }
                onCellMouseOut={HideActions}
                autoSize={true}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onUnassigndGridReady}
                gridApi={unassignedGridApi}
                gridColumnApi={unassignedGridColumnApi}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        title={t("delete_vehicle_key")}
        description={t("are_you_sure_you_want_to_delete_this_vehicle?_key")}
        confirmText={t("yes,_delete_it!_key")}
        cancelText={t("no,_cancel_key")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
        }}
      />
      {/* Edit Model */}
      <Model
        header={t("update_vehicle_information_key")}
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        updateButton={t("update_key")}
        footer={false}
        size={"xl"}
        className={"mt-5"}
      >
        <Edit
          handleModel={() => {
            setEditModalShow(false);
          }}
          icon={faExternalLinkAlt}
          editModel={true}
          id={editID}
          modelButtonMsg={t("open_in_new_tab_key")}
          className={`p-0 m-0`}
          onModelButtonClicked={() => {
            router.push({
              pathname: "/management/vehicle-management/edit/[editId]",
              query: { editId: editID },
            });
          }}
          updateAssignedTable={onAssigndGridReady}
          updateUnassignedTable={onUnassigndGridReady}
        />
      </Model>
      {/* assign device Model */}
      <Model
        header={t("assign_device_to_vehicle_key")}
        show={assignModalShow}
        onHide={() => setAssignModalShow(false)}
        updateButton={t("update_key")}
        footer={false}
        size={"xl"}
        className={"mt-5"}
      >
        <AssignDevice
          handleModel={() => {
            setAssignModalShow(false);
          }}
          id={assignVehicleID}
        />
      </Model>
      {/* Bulk Model */}
      <Model
        header={t("add_vehicles_bulk_key")}
        show={bulkModel}
        onHide={() => setBulkModel(false)}
        updateButton={t("update_key")}
        footer={false}
        size={"xl"}
        className={"mt-5"}
      >
        <Bulk
          excelData={excelData}
          handleModel={() => {
            setBulkModel(false);
          }}
          modelButtonMsg={t("download_template_key")}
          icon={faFileDownload}
          fileName={"VehiclesPatch"}
          bulkRequest={bulkDataHandler}
          loading={bulkLoading}
        />
      </Model>
    </div>
  );
}

export default VehicleManagment;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "management"])),
    },
  };
}
// translation ##################################
