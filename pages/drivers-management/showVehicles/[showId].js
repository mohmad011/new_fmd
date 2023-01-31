import React, { useCallback, useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import AgGridDT from "components/AgGridDT";
import {
  getDriverAssignedVehicles,
  fitchUnassignedVehicles,
  addVehicleToDriver,
  UnAssignVehicle,
} from "services/driversManagement";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function ShowVehicles(props) {
  const { showId } = props;
  const { t } = useTranslation("driversManagement");
  const [AssignedVehicles, setAssignedVehicles] = useState(null);
  const [UnAssignedVehicles, setUnAssignedVehicles] = useState(null);

  const [gridApiassigned, setGridApiassigned] = useState(null);
  const [gridColumnApiassigned, setGridColumnApiassigned] = useState(null);

  const [gridApiUnassigned, setGridApiUnassigned] = useState(null);
  const [gridColumnApiUnassigned, setGridColumnApiUnassigned] = useState(null);

  const [loadingAssignRq, setloadingAssignRq] = useState(false);
  const [loadingUnAssignRq, setloadingUnAssignRq] = useState(false);

  // fitch assigned Vehicles data
  const onGridassignReady = useCallback(
    async (params) => {
      try {
        const respond = await getDriverAssignedVehicles(showId);
        setAssignedVehicles([...respond?.vehicles]);
        setGridApiassigned(params.api);
        setGridColumnApiassigned(params.columnApi);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    [showId]
  );
  // fitch Unassigned Vehicles data
  const onGridUnassignReady = useCallback(async (params) => {
    try {
      const respond = await fitchUnassignedVehicles();
      setUnAssignedVehicles([...respond?.unAssingedVehs]);
      setGridApiUnassigned(params.api);
      setGridColumnApiUnassigned(params.columnApi);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, []);

  // unassign vehicle from driver
  const UnAssignVehicleRq = async (ele) => {
    setloadingUnAssignRq(true);
    try {
      const respond = await UnAssignVehicle(showId, ele.VehicleID);
      if (respond?.result[1] === 1) {
        toast.success("Vehicle UnAssigned Successfully");
        setAssignedVehicles((prev) => [
          ...prev.filter((vehicle) => vehicle.VehicleID != ele.VehicleID),
        ]);
        setUnAssignedVehicles((prev) => [...prev, ele]);
      }
      setloadingUnAssignRq(false);
    } catch (error) {
      toast.error(error?.response.data.message);
      setloadingUnAssignRq(false);
    }
  };

  // assign vehicles to driver
  const AssignVehicleRq = async (ele) => {
    setloadingAssignRq(true);
    try {
      const respond = await addVehicleToDriver(showId, ele.VehicleID);
      if (respond?.result[1] === 1) {
        toast.success("Vehicle Assigned Successfully");
        setUnAssignedVehicles((prev) => [
          ...prev.filter((vehicle) => vehicle.VehicleID != ele.VehicleID),
        ]);
        setAssignedVehicles((prev) => [ele, ...prev]);
      }
      setloadingAssignRq(false);
    } catch (error) {
      setloadingAssignRq(false);
      toast.error(error?.response.data.message);
    }
  };

  // columns used in ag grid
  const AssignedVecColumns = useMemo(
    () => [
      { headerName: t("group_name_key"), field: "GroupName", sortable: true },
      {
        headerName: t("plate_number_key"),
        field: "PlateNumber",
        sortable: true,
      },
      {
        headerName: t("display_name_key"),
        field: "DisplayName",
        sortable: true,
      },
      { headerName: t("color_key"), field: "Color", sortable: true },
      { headerName: t("makeYear_key"), field: "MakeYear", sortable: true },
      { headerName: t("typeID_key"), field: "TypeID", sortable: true },
      { headerName: t("modelID_key"), field: "ModelID", sortable: true },
      {
        headerName: t("actions_key"),
        cellRenderer: (params) => (
          <Button
            disabled={loadingUnAssignRq}
            onClick={() => UnAssignVehicleRq(params.data)}
          >
            {t("unassign_vehicle_key")}
          </Button>
        ),
        sortable: true,
        unSortIcon: true,
      },
    ],
    [loadingUnAssignRq, t]
  );
  const UnAssignedVecColumns = useMemo(
    () => [
      { headerName: t("group_name_key"), field: "GroupName", sortable: true },
      {
        headerName: t("plate_number_key"),
        field: "PlateNumber",
        sortable: true,
      },
      {
        headerName: t("display_name_key"),
        field: "DisplayName",
        sortable: true,
      },
      { headerName: t("color_key"), field: "Color", sortable: true },
      { headerName: t("makeYear_key"), field: "MakeYear", sortable: true },
      { headerName: t("typeID_key"), field: "TypeID", sortable: true },
      { headerName: t("modelID_key"), field: "ModelID", sortable: true },
      {
        headerName: t("actions_key"),
        cellRenderer: (params) => {
          return (
            <Button
              disabled={loadingAssignRq}
              onClick={() => {
                AssignVehicleRq(params.data);
              }}
            >
              {t("assign_vehicle_key")}
            </Button>
          );
        },
      },
    ],
    [loadingAssignRq, t]
  );

  return (
    <div className="container-fluid">
      <Card>
        <Card.Header className="h3">{t("assigned_vehicles_key")}</Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
            <div className="d-flex justify-content-center flex-wrap mb-4">
              <Link href="/drivers-management" passHref>
                <Button
                  variant="primary p-1 d-flex align-items-center"
                  className="m-1"
                  style={{ fontSize: "13px" }}
                >
                  <FontAwesomeIcon
                    className="me-2"
                    icon={faHistory}
                    size="sm"
                  />
                  {t("back_key")}
                </Button>
              </Link>
            </div>
          </div>
          <AgGridDT
            rowHeight={65}
            columnDefs={AssignedVecColumns}
            rowData={AssignedVehicles}
            suppressSizeToFit={true}
            paginationNumberFormatter={function (params) {
              return params.value.toLocaleString();
            }}
            onFirstDataRendered={(params) => {
              params.api.sizeColumnsToFit();
            }}
            onGridReady={onGridassignReady}
            gridApi={gridApiassigned}
            gridColumnApi={gridColumnApiassigned}
          />
        </Card.Body>
      </Card>
      <Card>
        <Card.Header className="h3">{t("unassigned_vehicles_key")}</Card.Header>
        <Card.Body>
          <AgGridDT
            rowHeight={65}
            columnDefs={UnAssignedVecColumns}
            rowData={UnAssignedVehicles}
            paginationNumberFormatter={function (params) {
              return params.value.toLocaleString();
            }}
            onFirstDataRendered={(params) => {
              params.api.sizeColumnsToFit();
            }}
            onGridReady={onGridUnassignReady}
            gridApi={gridApiUnassigned}
            gridColumnApi={gridColumnApiUnassigned}
          />
        </Card.Body>
      </Card>
    </div>
  );
}

// translation ##################################
export async function getServerSideProps({ locale, query }) {
  const { showId } = query;
  return {
    props: {
      ...(await serverSideTranslations(locale, ["driversManagement", "main"])),
      showId,
    },
  };
}
// translation ##################################
