import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Button, Form, Modal, Row } from "react-bootstrap";
import AgGridDT from "../../AgGridDT";
import HideActions from "hooks/HideActions";
import DeleteModal from "../../UI/DeleteModal";
import config from "config/config";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MenuTree from "./MenuTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
const AddGeofence = ({
  setAddGeofence,
  setGeofencesToggle,
  Data_table,
  setData_table,
  // setIsAddGeofence,
  setEditGeofence,
  setID,
  L,
  setGeofencesViewToggle,
  geofences,
  setGeofences,
  geofencesToggle,
}) => {
  const { darkMode } = useSelector((state) => state.config);
  const { t } = useTranslation("Table");
  const { myMap } = useSelector((state) => state.mainMap);

  const [GeoFenceData, setGeoFenceData] = useState({});
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [loading, setLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState(0);

  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [treeFilter, setTreeFilter] = useState("");

  const [vehicleIds, setVehicleIds] = useState([]);
  const [vehicleIdsChecked, setVehicleIdsChecked] = useState([]);

  const { locale } = useRouter();
  // const [showAssignedVehicles, setShowAssignedVehicles] = useState(false);

  //first page to render in the AG grid table
  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(0);
    // gridOptions.api.resetRowHeights();
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

  //set the Api of the AG grid table
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleGeoFenceType = (params) => {
    const allData = {
      1: "Polygon",
      2: "Circle",
      3: "Rectangle",
    };
    return allData[params.data.GeoFenceType];
  };

  const handleShowVehicle = (params) => {
    setShowVehicleModal(true);
    setVehicleId(params.data.ID);
  };

  const handleShowFence = (params) => {
    setGeofencesViewToggle(false);
    let drawGroup = myMap.groups.drawGroup;
    const show = drawGroup
      .getLayers()
      .filter((x) => x.options.FenceID == params.data.ID);

    drawGroup.clearLayers();

    let path = params.data.GeofencePath;

    let options = {
      FenceID: params.data.ID,
      color: "red",
    };

    if (show.length === 0) {
      switch (params.data.GeoFenceType) {
        case 1: // polygon
          L.polygon(path, options).addTo(drawGroup);
          break;
        case 2: // circle
          L.circle(path, {
            ...options,
            radius: +params.data.GeofenceRadius,
          }).addTo(drawGroup);
          break;
        case 3: // rectangle
          L.rectangle(path, options).addTo(drawGroup);
          break;
      }
    } else {
      drawGroup.removeLayer(L.stamp(show[0]));
    }
  };

  const columns = useMemo(
    () => [
      {
        headerName: `${t("Geofence_Name")}`,
        field: "GeofenceName",
        cellRenderer: (params) => (
          <>
            <Link
              href={`Driver/${params.ID}`}
              className="text-decoration-underline"
            >
              <a>{params.value}</a>
            </Link>
            <div className="d-flex gap-2  options">
              <span
                className=""
                onClick={() => {
                  setEditGeofence(true);
                  setAddGeofence(false);
                  setGeofencesToggle(false);
                  setID(params.data.ID);
                }}
              >
                {t("Edit_Geofence")} |{" "}
              </span>

              <span onClick={() => handleShowFence(params)}>
                {t("Show_Geofence")} |{" "}
              </span>

              <span onClick={() => handleShowVehicle(params)}>
                {t("Show_Vehicle")}
              </span>
              <span
                onClick={() => {
                  setshowModalDelete(true);
                  setGeoFenceData(params.data);
                }}
                className=""
              >
                {" "}
                | {t("Delete")}
              </span>
            </div>
          </>
        ),
      },
      {
        headerName: `${t("Geofence_Type")}`,
        field: "GeoFenceType",
        valueGetter: handleGeoFenceType,
      },
      {
        headerName: `${t("Geofence_Speed")}`,
        field: "Speed",
      },
    ],
    [t, Data_table, Data_table.length]
  );

  useEffect(() => {
    if (geofencesToggle) {
      if (geofences.length > 0) {
        setData_table([...geofences]);
      } else {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `geofences/dev`);
            let handledData = response.data?.allGeoFences?.map(
              (item) => item.handledData
            );
            await handledData?.map((item) => {
              // check if a circle
              if (item.GeoFenceType === 2) {
                let GeofencePath = [];
                item.GeofencePath?.map((item) => {
                  item?.map((item) => GeofencePath.push(+item));
                });
                item.GeofencePath = GeofencePath;
              } else {
                item.GeofencePath = item.GeofencePath?.map((item) =>
                  item?.map((item) => +item)
                );
              }
            });

            setGeofences(handledData);
            setData_table(handledData);
          } catch (error) {
            toast.error(error?.message);
          }
        };

        fetchData();
      }
    }
  }, [geofences.length, geofencesToggle]);

  const onDelete = async () => {
    setloadingDelete(false);
    try {
      let res = await axios.delete(
        `geofences/${GeoFenceData.ID}`);

      if (res.status === 200) {
        toast.success(GeoFenceData.GeofenceName + t("deleted_successfully"));
        let Layers = myMap.groups.drawGroup.getLayers();
        let filteredItem = Data_table.filter(
          (itemFiltered) => itemFiltered.ID != GeoFenceData.ID
        );
        if (Layers.length > 0) {
          let options = {
            color: "red",
          };

          myMap.groups.drawGroup.clearLayers();

          filteredItem?.map((item) => {
            let path = item.GeofencePath;
            switch (item.GeoFenceType) {
              case 1: // polygon
                L.polygon(path, options).addTo(myMap.groups.drawGroup);
                break;
              case 2: // circle
                L.circle(path, {
                  ...options,
                  radius: +item.GeofenceRadius,
                }).addTo(myMap.groups.drawGroup);
                break;
              case 3: // rectangle
                L.rectangle(path, options).addTo(myMap.groups.drawGroup);
                break;
            }
          });
        }

        setGeofences([...filteredItem]);
        setData_table([...filteredItem]);
      }
    } catch (e) {
      console.log("Error: " + e.message);
    } finally {
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  const handleCloseModal = () => {
    setAddGeofence(false);
    setEditGeofence(false);
    setGeofencesToggle(false);
  };

  const handleAddModal = () => {
    setAddGeofence(true);
    setEditGeofence(false);
    setGeofencesToggle(false);
    setGeofencesViewToggle(false);
  };

  const handleSaveAssignedVehicles = async (name) => {
    if (name === "save") {
      setLoading(true);
      let vehicleIdsAreAdded = [];
      let vehicleIdsAreRemoved = [];
      let uniqeVehicleIds = [...new Set([...vehicleIds])];
      let handleRequest;
      try {
        if (
          vehicleIdsChecked.every((item) => uniqeVehicleIds.includes(item)) &&
          vehicleIdsChecked.length === uniqeVehicleIds.length
        ) {
          setTimeout(() => {
            setShowVehicleModal(false);
          }, 500);
          return;
        }

        // add vehicleIds
        vehicleIdsChecked
          .filter((item) => !uniqeVehicleIds.includes(item))
          .forEach((item) => vehicleIdsAreAdded.push(item));

        // remove vehicleIds
        uniqeVehicleIds
          .filter((item) => !vehicleIdsChecked.includes(item))
          .forEach((item) => vehicleIdsAreRemoved.push(item));

        if (vehicleIdsAreAdded.length > 0 || vehicleIdsAreRemoved.length > 0) {
          handleRequest = async (api, geoId, vhsId) => {
            return await axios.post(
              api,
              {
                geoId: String(geoId),
                vhsId,
              },
              { headers: { "Content-Type": "application/json" } }
            );
          };
        }

        if (vehicleIdsAreAdded.length > 0) {
          handleRequest(
            `${config.apiGateway.URL}geofences/assignVhs`,
            vehicleId,
            vehicleIdsAreAdded
          ).then((resp) => {
            if (resp.status === 201) {
              setTimeout(() => {
                toast.success("Add Vehicles to Geofence is Successfully.");
                setLoading(false);
                setShowVehicleModal(false);
              }, 500);
            } else {
              toast.error(`Error: Can Not Add Geofence `);
            }
          });
        }

        if (vehicleIdsAreRemoved.length > 0) {
          handleRequest(
            `${config.apiGateway.URL}geofences/deleteVhs`,
            vehicleId,
            vehicleIdsAreRemoved
          ).then((resp) => {
            if (resp.status === 200) {
              setTimeout(() => {
                toast.success(
                  "Remove Some Of Vehicles That In Geofence Is Successfully."
                );
                setLoading(false);
                setShowVehicleModal(false);
              }, 500);
            } else {
              toast.error(`Error: Can Not Add Geofence `);
            }
          });
        }
      } catch (e) {
        console.log(" Error:  " + e.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setShowVehicleModal(false);
        }, 500);
      }
    } else {
      setShowVehicleModal(false);
    }
  };

  return (
    <div
      className="pb-3 add_geofence_track_page"
      style={{
        left: locale === "ar" ? "20px" : "auto",
        right: locale === "ar" ? "auto" : "20px",
        background: darkMode ? "#222738" : "#FFFFFF",
      }}
    >
      {/* <Modal.Body> */}
      <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
        <div className="d-flex justify-content-between flex-wrap mb-4 w-100">
          <Button
            variant="primary p-1 d-flex align-items-center"
            className="mx-2 px-3 py-1 m-2 bg-primary"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            onClick={handleAddModal}
          >
            {t("Add_Geofence")}
          </Button>

          <Button
            variant="outline-secondary p-1 d-flex align-items-center"
            className="me-2 px-3 py-1 m-2 bg-white"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            onClick={handleCloseModal}
          >
            <svg
              height="24px"
              width="24px"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>close</title>
              <desc>Created with sketchtool.</desc>
              <g
                id="web-app"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g id="close" fill="#000000">
                  <polygon
                    id="Shape"
                    points="10.6568542 12.0710678 5 6.41421356 6.41421356 5 12.0710678 10.6568542 17.7279221 5 19.1421356 6.41421356 13.4852814 12.0710678 19.1421356 17.7279221 17.7279221 19.1421356 12.0710678 13.4852814 6.41421356 19.1421356 5 17.7279221"
                  ></polygon>
                </g>
              </g>
            </svg>
          </Button>
        </div>
      </div>

      <AgGridDT
        Height="50vh"
        gridHeight="50%"
        rowHeight={65}
        columnDefs={columns}
        rowData={Data_table}
        rowSelection={"multiple"}
        onCellMouseOver={(e) => (e.event.path[1].dataset.test = "showActions")}
        onCellMouseOut={HideActions}
        paginationNumberFormatter={function (params) {
          return params.value.toLocaleString();
        }}
        onFirstDataRendered={onFirstDataRendered}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        overlayNoRowsTemplate={t("loading")}
        gridApi={gridApi}
        gridColumnApi={gridColumnApi}
      />
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        title={t("Are_you_sure")}
        description={t("Are_you_sure_you_want_to_delete_this_GeoFence")}
        confirmText={t("Yes_delete_it")}
        cancelText={t("No_cancel")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
          setloadingDelete(false);
        }}
      />

      <Modal
        show={showVehicleModal}
        onHide={() => handleSaveAssignedVehicles("modal")}
        name="modal"
      >
        <Modal.Header
          closeButton
          style={{
            background: darkMode ? "#222738" : "#FFFFFF",
            borderBottomColor: darkMode ? "#151824" : "#DDD",
          }}
        >
          <Modal.Title>{t("Select_Vehicles")}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            background: darkMode ? "#222738" : "#FFFFFF",
          }}
        >
          <Row>
            <Form.Group controlId="Geofence Speed">
              <Form.Control
                className="border-primary form-control fw-bold col-12 col-md-3 mb-3"
                name="Speed"
                value={treeFilter}
                onChange={(e) => setTreeFilter(e.target.value)}
                type="text"
                placeholder={t("Enter_Displayed_Name")}
                required={true}
              // onKeyPress={handleSpeedOnKeyPress}
              />
              {/* <Button
                variant="primary"
                size="lg"
                onClick={() => setShowAssignedVehicles(!showAssignedVehicles)}
                className="col-12 col-md-5 mb-3"
              >
                Show Assigned Vehicles
              </Button> */}
            </Form.Group>
          </Row>
          <MenuTree
            setVehicleId={setVehicleId}
            vehicleId={vehicleId}
            treeFilter={treeFilter}
            vehicleIds={vehicleIds}
            setVehicleIds={setVehicleIds}
            setVehicleIdsChecked={setVehicleIdsChecked}
            vehicleIdsChecked={vehicleIdsChecked}
          // showAssignedVehicles={showAssignedVehicles}
          />
        </Modal.Body>
        <Modal.Footer
          style={{
            background: darkMode ? "#222738" : "#FFFFFF",
            borderTopColor: darkMode ? "#151824" : "#DDD",
          }}
        >
          <Button
            variant="secondary"
            className="px-2 py-1 d-inline-flex justify-content-center align-items-center"
            onClick={() => {
              setShowVehicleModal(false);
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
            <span>{t("Cancel")}</span>
          </Button>
          <Button
            variant="primary"
            name="save"
            className="px-2 py-1 d-inline-flex justify-content-center align-items-center"
            onClick={() => handleSaveAssignedVehicles("save")}
            disabled={loading}
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
            <span>{t("Save")}</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddGeofence;
