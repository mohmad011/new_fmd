import React, { useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Card } from "react-bootstrap";
import Link from "next/link";
import AgGridDT from "components/AgGridDT";
import { viewHistory } from "services/preventiveMaintenance";
import { toast } from "react-toastify";

const ViewHistory = () => {
  const { t } = useTranslation("preventiveMaintenance");
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [DataTable, setDataTable] = useState(null);

  // fecth all history data and set the Api of the AG grid table for export pdf
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await viewHistory();
      setDataTable(respond.result);
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  }, []);

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
      unSortIcon: true,
    };
  }, []);

  // change the value of MaintenanceType that came from http reqeust to its name
  const handleMaintenanceType = (params) => {
    const allData = {
      1: t("engine_oil_change_key"),
      2: t("change_vehicle_brakes_key"),
      3: t("vehicle_license_renew_key"),
      4: t("vehicle_wash_key"),
      5: t("tires_change_key"),
      6: t("transmission_oil_change_key"),
      7: t("filter_change_key"),
      8: t("others_key"),
    };
    return allData[params?.data?.MaintenanceType];
  };

  // change the value of PeriodType that came from http reqeust to its name
  const handlePeriodType = (params) => {
    const allData = {
      1: t("by_mileage_key"),
      2: t("by_fixed_date_key"),
      4: t("by_working_hours_key"),
    };
    return allData[params.data.PeriodType];
  };

  // change the value of Recurring that came from http reqeust to true/false
  const handleRecurring = (params) => {
    return params?.data?.Recurring ? "true" : "false";
  };

  // change the value of NotifyPeriod that came from http reqeust to its name
  const handleNotifyPeriod = (params) => {
    const allData = {
      1: t("percentage_key"),
      2: t("value_key"),
    };
    return allData[params?.data?.WhenPeriod];
  };

  // columns used in ag grid
  const columns = useMemo(
    () => [
      {
        headerName: `${t("display_name_key")}`,
        field: "DisplayName",
        minWidth: 200,
      },
      {
        headerName: `${t("plate_number_key")}`,
        field: "PlateNumber",
        minWidth: 200,
      },
      {
        headerName: `${t("maintenance_key")}`,
        field: "MaintenanceType",
        minWidth: 200,
        valueGetter: handleMaintenanceType,
      },
      {
        headerName: `${t("period_type_key")}`,
        field: "PeriodType",
        minWidth: 200,
        valueGetter: handlePeriodType,
      },
      {
        headerName: `${t("start_value_key")}`,
        field: "StartValue",
        minWidth: 200,
      },
      {
        headerName: `${t("maintenance_due_value_key")}`,
        field: "NextValue",
        minWidth: 250,
      },
      {
        headerName: `${t("recurring_key")}`,
        field: "Recurring",
        minWidth: 200,
        valueGetter: handleRecurring,
      },
      {
        headerName: `${t("notify_period_key")}`,
        field: "NotifPeriod",
        minWidth: 250,
        valueGetter: handleNotifyPeriod,
      },
      {
        headerName: `${t("notify_when_value_key")}`,
        field: "WhenValue",
        minWidth: 250,
      },
      {
        headerName: `${t("current_value_key")}`,
        field: "CurrentValue",
        minWidth: 200,
      },
      {
        headerName: `${t("original_value_key")}`,
        field: "OrginalValue",
        minWidth: 200,
      },
    ],
    [t]
  );

  return (
    <div className="container-fluid">

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
            <div className="d-flex justify-content-center flex-wrap mb-4">
              <Link href="/preventive-maintenance" passHref>
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
            columnDefs={columns}
            rowData={DataTable}
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

    </div>
  );
};

export default ViewHistory;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "preventiveMaintenance"])),
    },
  };
}
// translation ##################################
