import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "next-i18next";
import { toggle } from "lib/slices/toggleMinuTrack";
import Styles from "styles/WidgetMenu.module.scss";
import { useDispatch, useSelector } from "react-redux";

import MenuTree from "./menuTree";
import FilterTree from "./cars-filter";
import InputsFilter from "./inputsFilter";

import { Resizable } from "react-resizable";
import axios from "axios";
import { toast } from "react-toastify";
import { FormCheck } from "react-bootstrap";
const WidgetMenu = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();

  const label = { "aria-label": "Switch demo" };
  const { toggleMinuTrack, config } = useSelector((state) => state);

  const { VehTreeData, VehTotal } = useSelector((state) => state.streamData);
  const [mainFilter, setmainFilter] = useState(null);
  const [carsIconsFilter, setcarsIconsFilter] = useState(null);
  const [serialNumberFilter, setserialNumberFilter] = useState("");
  const [addressFilter, setaddressFilter] = useState("");
  const [speedFromFilter, setspeedFromFilter] = useState("");
  const [speedToFilter, setspeedToFilter] = useState("");

  const [displayNameFilter, setDisplayNameFilter] = useState("");
  const [plateNumberFilter, setPlateNumberFilter] = useState("");

  const isOpenMinuTrack = toggleMinuTrack.value;

  const filteredTreeData = useMemo(() => {
    // with no filters
    if (
      mainFilter == null &&
      carsIconsFilter == null &&
      serialNumberFilter == "" &&
      addressFilter == "" &&
      speedFromFilter == "" &&
      speedToFilter == ""
    ) {
      return VehTreeData;

      // filter Active  Vehs
    } else if (mainFilter === 5) {
      return VehTreeData.filter(
        (e) => e.VehicleStatus !== 5 && e.VehicleStatus !== 600
      ).filter((ele) => {
        if (serialNumberFilter !== "") {
          return ele?.SerialNumber?.startsWith(serialNumberFilter) || false;
        } else if (addressFilter !== "") {
          return ele?.Address?.startsWith(addressFilter) || false;
        } else if (speedFromFilter !== "") {
          return (
            (ele?.Speed > speedFromFilter &&
              ele?.Speed < (speedToFilter?.length ? speedToFilter : 200)) ||
            false
          );
        } else if (speedToFilter !== "") {
          return (
            (ele?.Speed < speedToFilter && ele?.Speed > speedFromFilter) ||
            false
          );
        } else {
          return ele;
        }
      });
      // filter Offline  Vehs
    } else if (mainFilter === -5 || carsIconsFilter === -5) {
      return VehTreeData.filter(
        (e) => e.VehicleStatus === 5 || e.VehicleStatus === 600
      ).filter((ele) => {
        if (serialNumberFilter !== "") {
          return ele?.SerialNumber?.startsWith(serialNumberFilter) || false;
        } else if (addressFilter !== "") {
          return ele?.Address?.startsWith(addressFilter) || false;
        } else if (speedFromFilter !== "") {
          return (
            (ele?.Speed > speedFromFilter &&
              ele?.Speed < (speedToFilter?.length ? speedToFilter : 200)) ||
            false
          );
        } else if (speedToFilter !== "") {
          return (
            (ele?.Speed < speedToFilter && ele?.Speed > speedFromFilter) ||
            false
          );
        } else {
          return ele;
        }
      });
      // filter Icons Cars  Vehs
    } else if (carsIconsFilter !== null && carsIconsFilter !== -5) {
      return VehTreeData.filter(
        (e) => e.VehicleStatus === carsIconsFilter
      ).filter((ele) => {
        if (serialNumberFilter !== "") {
          return ele?.SerialNumber?.startsWith(serialNumberFilter) || false;
        } else if (addressFilter !== "") {
          return ele?.Address?.startsWith(addressFilter) || false;
        } else if (speedFromFilter !== "") {
          return (
            (ele?.Speed > speedFromFilter &&
              ele?.Speed < (speedToFilter?.length ? speedToFilter : 200)) ||
            false
          );
        } else if (speedToFilter !== "") {
          return (
            (ele?.Speed < speedToFilter && ele?.Speed > speedFromFilter) ||
            false
          );
        } else {
          return ele;
        }
      });
    } else if (serialNumberFilter !== "") {
      return (
        VehTreeData.filter((e) =>
          e?.SerialNumber?.startsWith(serialNumberFilter)
        ) || false
      );
    } else if (addressFilter !== "") {
      return (
        VehTreeData.filter((e) => e?.Address?.startsWith(addressFilter)) ||
        false
      );
    }

    // Speed From
    else if (speedFromFilter !== "") {
      return (
        VehTreeData.filter(
          (e) =>
            e?.Speed > speedFromFilter &&
            e?.Speed < (speedToFilter?.length ? speedToFilter : 200)
        ) || false
      );
    }
    // Speed To
    else if (speedToFilter !== "") {
      return (
        VehTreeData.filter(
          (e) => e?.Speed < speedToFilter && e?.Speed > speedFromFilter
        ) || false
      );
    }

    // return VehTreeData
  }, [
    mainFilter,
    carsIconsFilter,
    VehTreeData,
    addressFilter,
    serialNumberFilter,
    speedToFilter,
    speedFromFilter,
  ]);

  const [ToggleConfig, setToggleConfig] = useState({
    ToggleConfig: [
      { name: "Speed", value: true },
      { name: "Mileage", value: true },
      { name: "TotalWeight", value: true },
      { name: "Direction", value: false },
      { name: "EngineStatus", value: false },
      { name: "Temp", value: false },
      { name: "Humidy", value: false },
    ],
    ToggleConfigSettings: [
      { name: "DisplayName", value: true },
      { name: "PlateNumber", value: false },
      { name: "SerialNumber", value: true },
    ],
    treeBoxWidth: 21.875 * 16,
  });
  const [isToggleConfigOpen, setisToggleConfigOpen] = useState(false);

  const handleMainFilter = (e, resetCarsFilt = true) => {
    if (resetCarsFilt === true) {
      setcarsIconsFilter(null);
    }
    switch (e) {
      case "offline":
        setmainFilter(-5);
        break;
      case "active":
        setmainFilter(5);
        break;
      default:
        setmainFilter(null);
        break;
    }
  };
  const handleToggleMinuTrack = () => {
    dispatch(toggle());
  };

  const fetchDataConfigWidgetMenu = async () => {
    await axios
      .get(`config`)
      .then((response) => {
        const configrations = response.data.configs[0].configrations;
        if (configrations) {
          setToggleConfig({
            ToggleConfig: [
              {
                name: "Speed",
                value:
                  configrations["Speed"] || ToggleConfig.ToggleConfig["Speed"],
              },
              {
                name: "Mileage",
                value:
                  configrations["Mileage"] ||
                  ToggleConfig.ToggleConfig["Mileage"],
              },
              {
                name: "TotalWeight",
                value:
                  configrations["TotalWeight"] ||
                  ToggleConfig.ToggleConfig["TotalWeight"],
              },
              {
                name: "Direction",
                value:
                  configrations["Direction"] ||
                  ToggleConfig.ToggleConfig["Direction"],
              },
              {
                name: "EngineStatus",
                value:
                  configrations["EngineStatus"] ||
                  ToggleConfig.ToggleConfig["EngineStatus"],
              },
              {
                name: "Temp",
                value:
                  configrations["Temp"] || ToggleConfig.ToggleConfig["Temp"],
              },
              {
                name: "Humidy",
                value:
                  configrations["Humidy"] ||
                  ToggleConfig.ToggleConfig["Humidy"],
              },
            ],
            ToggleConfigSettings: [
              {
                name: "DisplayName",
                value:
                  configrations["DisplayName"] ||
                  ToggleConfig.ToggleConfigSettings["DisplayName"],
              },
              {
                name: "PlateNumber",
                value:
                  configrations["PlateNumber"] ||
                  ToggleConfig.ToggleConfigSettings["PlateNumber"],
              },
              {
                name: "SerialNumber",
                value:
                  configrations["SerialNumber"] ||
                  ToggleConfig.ToggleConfigSettings["SerialNumber"],
              },
            ],
            treeBoxWidth:
              configrations["treeBoxWidth"] ||
              ToggleConfig.ToggleConfigSettings["treeBoxWidth"],
          });
        }
      })
      .catch((err) => toast.error(err.message));
  };
  useEffect(() => {
    setTimeout(() => {
      fetchDataConfigWidgetMenu();
    }, 8000);
  }, []);

  const handleConfigActive = (toggle) => {
    if (toggle.value) {
      if (
        ToggleConfig.ToggleConfig.filter((toggle) => toggle.value).length === 1
      )
        return true;
      return false;
    } else {
      if (
        ToggleConfig.ToggleConfig.filter((toggle) => toggle.value).length === 4
      )
        return true;
      return false;
    }
  };
  const handleConfigSettingActive = (toggle) => {
    if (toggle.value) {
      if (
        ToggleConfig.ToggleConfigSettings.filter((toggle) => toggle.value)
          .length === 1
      )
        return true;
      return false;
    } else {
      if (
        ToggleConfig.ToggleConfigSettings.filter((toggle) => toggle.value)
          .length === 2
      )
        return true;
      return false;
    }
  };

  const handleSaveUpdates = async () => {
    const _newConfig = {
      configrations: [
        ...ToggleConfig.ToggleConfig?.map((ele) => {
          return { [ele.name]: ele.value };
        }),
        ...ToggleConfig.ToggleConfigSettings?.map((ele) => {
          return { [ele.name]: ele.value };
        }),
        { treeBoxWidth: ToggleConfig.treeBoxWidth },
      ],
    };
    setisToggleConfigOpen(false);
    await axios
      .post(`config`, _newConfig, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        toast.error(err.meesage);
      });
  };
  const onResize = (event, { size }) => {
    setToggleConfig({
      ...ToggleConfig,
      treeBoxWidth: size.width,
    });
  };

  return (
    <aside className={`${config.darkMode && Styles.dark}`}>
      <nav
        className={`${Styles.nav} ${isOpenMinuTrack && Styles.active
          } position-absolute rounded shadow-lg pt-5 overflow-hidden`}
        id="widget_menu"
        style={{
          width: parseInt(ToggleConfig?.treeBoxWidth) + "px",
        }}
      >
        <Resizable
          width={+ToggleConfig?.treeBoxWidth}
          height={200}
          onResize={onResize}
          resizeHandles={["w"]}
          className="box"
          maxConstraints={[700, 100]}
          minConstraints={[21.875 * 16, 100]}
          axis="x"
        >
          <>
            {/* Main Filter */}
            <div
              className={`${Styles.nav__item} ${isOpenMinuTrack && Styles.active
                }`}
            >
              <div
                className={`${Styles.section__one} d-flex align-items-center justify-content-center text-center`}
              >
                <input
                  type="radio"
                  name="filterBtn"
                  className="btn-check"
                  id="btn-check-all"
                  autoComplete="off"
                  onClick={() => handleMainFilter("", true)}
                  defaultChecked
                />
                <label
                  className="btn btn-outline-primary mx-2 rounded d-flex  justify-content-center flex-column"
                  htmlFor="btn-check-all"
                >
                  <span>{t("All")}</span>
                  <span>{VehTotal.totalVehs}</span>
                </label>

                <input
                  type="radio"
                  name="filterBtn"
                  className="btn-check"
                  id="btn-check-active"
                  autoComplete="off"
                  onClick={() => handleMainFilter("active", true)}
                />
                <label
                  className="btn btn-outline-primary mx-2 rounded d-flex  justify-content-center flex-column"
                  htmlFor="btn-check-active"
                >
                  <span>{t("Active")}</span>
                  <span>{VehTotal.activeVehs}</span>
                </label>

                <input
                  type="radio"
                  name="filterBtn"
                  className="btn-check"
                  id="btn-check-offline"
                  autoComplete="off"
                  onClick={() => handleMainFilter("offline", true)}
                />
                <label
                  className="btn btn-outline-primary mx-2 rounded d-flex  justify-content-center flex-column"
                  htmlFor="btn-check-offline"
                >
                  <span>{t("Offline")}</span>
                  <span>{VehTotal.offlineVehs}</span>
                </label>
              </div>
            </div>

            {/* Cars Filter */}
            <div
              className={`${Styles.nav__item} ${isOpenMinuTrack && Styles.active
                } mb-1`}
            >
              <FilterTree
                config={config}
                active={isOpenMinuTrack}
                carsIconsFilter={carsIconsFilter}
                handleMainFilter={handleMainFilter}
                setcarsIconsFilter={setcarsIconsFilter}
              />
            </div>

            <div
              className={`${Styles.nav__item} ${isOpenMinuTrack && Styles.active
                } mb-1`}
            >
              <InputsFilter
                t={t}
                serialNumberFilter={serialNumberFilter}
                setserialNumberFilter={setserialNumberFilter}
                setaddressFilter={setaddressFilter}
                addressFilter={addressFilter}
                speedFromFilter={speedFromFilter}
                setspeedFromFilter={setspeedFromFilter}
                speedToFilter={speedToFilter}
                setspeedToFilter={setspeedToFilter}
                displayNameFilter={displayNameFilter}
                setDisplayNameFilter={setDisplayNameFilter}
                plateNumberFilter={plateNumberFilter}
                setPlateNumberFilter={setPlateNumberFilter}
                ToggleConfigSettings={ToggleConfig.ToggleConfigSettings}
              />
            </div>

            {/* MenuTree */}
            <div
              className={`${Styles.nav__item} ${isOpenMinuTrack && Styles.active
                } border-top pt-2`}
            >
              <MenuTree
                addressFilter={addressFilter}
                serialNumberFilter={serialNumberFilter}
                treeData={filteredTreeData || []}
                ToggleConfig={ToggleConfig}
                speedFromFilter={speedFromFilter}
                speedToFilter={speedToFilter}
                displayNameFilter={displayNameFilter}
                plateNumberFilter={plateNumberFilter}
              />
            </div>

            {/* Config Settings */}
            <button
              onClick={() => setisToggleConfigOpen((prev) => !prev)}
              type="button"
              className={Styles.config_btn}
            >
              <FontAwesomeIcon icon={faSlidersH} />
            </button>

            <div
              className={`${Styles.config} ${isToggleConfigOpen && Styles.active
                }`}
            >
              <button
                onClick={() => setisToggleConfigOpen((prev) => !prev)}
                type="button"
                className={Styles.config_btn_close}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h4 className={`${Styles.title} pt-2`}>{t("Config")}</h4>
              <div
                className={`sidebar-body pt-3 data-scrollbar menu-scrollbar ${Styles.config_main}`}
                data-scroll="1"
              >
                <div
                  className={`${Styles.nav__item} ${isOpenMinuTrack && Styles.active
                    }`}
                >
                  <div className="container">
                    <div className="row">
                      {/* <p className="fs-5 text-secondary text-center">
                        {t("Widget width")}
                      </p> */}
                      <div className="d-flex justify-content-between align-items-center mt-5">
                        <span
                          className={`text-${config.darkMode ? "light" : "primary"
                            }`}
                        >
                          800px
                        </span>
                        <span
                          className={`text-${config.darkMode ? "light" : "primary"
                            }`}
                        >
                          350px
                        </span>
                      </div>
                      <input
                        style={{
                          transform: "rotate(-180deg)",
                          background: "none",
                        }}
                        type="range"
                        id="WedgitTreeWidthInput"
                        name="volume"
                        step={5}
                        value={ToggleConfig?.treeBoxWidth}
                        onChange={(e) => {
                          setToggleConfig({
                            ...ToggleConfig,
                            treeBoxWidth: e.currentTarget.value,
                          });
                        }}
                        min={parseInt(21.875 * 16)}
                        max="800"
                      />
                    </div>
                    <div className="row">
                      <p className="fs-5 text-secondary text-center">
                        {t("Meters_Settings")}
                      </p>
                      {ToggleConfig?.ToggleConfig?.map((toggle, index) => (
                        <div
                          key={index}
                          className="mt-3"
                          style={{ width: "175px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ minWidth: "90px" }}>
                              <span
                                style={{
                                  color: toggle?.name
                                    ? config.darkMode
                                      ? "#ddd"
                                      : "#246c66"
                                    : config.darkMode
                                      ? "#8A92A6"
                                      : "#575757",
                                  fontSize: ".9rem",
                                }}
                              >
                                {t(toggle?.name)}
                              </span>
                            </div>

                            <FormCheck
                              onChange={(e) => {
                                const newObg =
                                  ToggleConfig?.ToggleConfig.findIndex(
                                    (ele) => ele.name === e.target.name
                                  );
                                setToggleConfig({
                                  ...ToggleConfig,
                                  ToggleConfig: [
                                    ...ToggleConfig?.ToggleConfig.slice(
                                      0,
                                      newObg
                                    ),
                                    {
                                      name: e.target.name,
                                      value: !toggle.value,
                                    },
                                    ...ToggleConfig?.ToggleConfig.slice(
                                      newObg + 1
                                    ),
                                  ],
                                });
                              }}
                              {...label}
                              style={{
                                color: toggle?.value
                                  ? config.darkMode
                                    ? "#FFF"
                                    : "#246c66"
                                  : config.darkMode
                                    ? "#8A92A6"
                                    : "#575757",
                              }}
                              name={toggle?.name}
                              value={toggle?.value}
                              checked={toggle?.value}
                              disabled={handleConfigActive(toggle)}
                            />
                          </div>
                        </div>
                      ))}
                      <hr className="mt-2 bg-secondary" />
                      <p className="fs-5 text-secondary text-center">
                        {t("Display_Settings")}
                      </p>
                      {ToggleConfig?.ToggleConfigSettings?.map(
                        (toggle, index) => (
                          <div
                            key={index}
                            className="mt-3"
                            style={{ width: "175px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div style={{ minWidth: "90px" }}>
                                <span
                                  style={{
                                    color: toggle?.value
                                      ? config.darkMode
                                        ? "#FFF"
                                        : "#246c66"
                                      : config.darkMode
                                        ? "#8A92A6"
                                        : "#575757",
                                    fontSize: ".9rem",
                                  }}
                                >
                                  {t(toggle?.name)}
                                </span>
                              </div>
                              <FormCheck
                                onChange={(e) => {
                                  const newObg =
                                    ToggleConfig?.ToggleConfigSettings.findIndex(
                                      (ele) => ele.name === e.target.name
                                    );
                                  setToggleConfig({
                                    ...ToggleConfig,
                                    ToggleConfigSettings: [
                                      ...ToggleConfig?.ToggleConfigSettings.slice(
                                        0,
                                        newObg
                                      ),
                                      {
                                        name: e.target.name,
                                        value: !toggle.value,
                                      },
                                      ...ToggleConfig?.ToggleConfigSettings.slice(
                                        newObg + 1
                                      ),
                                    ],
                                  });
                                }}
                                {...label}
                                style={{
                                  color: toggle?.value
                                    ? config.darkMode
                                      ? "#FFF"
                                      : "#246c66"
                                    : config.darkMode
                                      ? "#8A92A6"
                                      : "#575757",
                                }}
                                name={toggle?.name}
                                value={toggle?.value}
                                checked={toggle?.value}
                                disabled={handleConfigSettingActive(toggle)}
                              />
                            </div>
                          </div>
                        )
                      )}
                      <div className="my-3">
                        <button
                          onClick={handleSaveUpdates}
                          className="btn btn-primary w-50 d-block px-4 py-2 mx-auto mb-4"
                        >
                          {t("Save_changes")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Resizable>
      </nav>
      {/* The Main Btn */}
      <div
        onClick={handleToggleMinuTrack}
        className={`${Styles.hamburger} ${isOpenMinuTrack && Styles.active}`}
      // className={`${Styles.hamburger} `}
      >
        <span className={Styles.hamburger__patty} />
        <span className={Styles.hamburger__patty} />
        <span className={Styles.hamburger__patty} />
      </div>
    </aside>
  );
};

export default WidgetMenu;
