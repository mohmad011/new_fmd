import React, { useEffect, useState } from "react";
import Tree, { TreeNode } from "rc-tree";
import "rc-tree/assets/index.css";
import Styles from "styles/Tree.module.scss";
import { useSelector } from "react-redux";
import { GetStatusString, iconUrl } from "helpers/helpers";
import Image from "next/image";

const MenuTree = ({
  treeData,
  ToggleConfig,
  serialNumberFilter,
  addressFilter,
  speedFromFilter,
  speedToFilter,

  displayNameFilter,
  plateNumberFilter,
}) => {
  const { myMap } = useSelector((state) => state.mainMap);

  const [statusIcons] = useState({});
  const [TreeStyleHeight, setTreeStyleHeight] = useState(0);

  const darkMode = useSelector((state) => state.config.darkMode);

  const defaultExpandedKeys = ["All"];

  const handleGroups = (groups) => {
    if (groups["Default"]) {
      groups["Default"] = [...groups["Default"]];
      groups["Un Group"] = [...groups["null"]];
    } else if (groups["null"]) {
      groups["Un Group"] = [...groups["null"]];
    }
    delete groups["null"];
    let result = [];
    result.push({
      title: "All",
      children: [groups],
    });
    for (let key in result[0]?.children[0]) {
      if (Object.hasOwn(result[0]?.children[0], key))
        result[0]?.children?.push({
          title: key,
          children: result[0]?.children[0][key],
        });
    }

    result[0]?.children?.splice(0, 1);
    return result;
  };

  const onCheck = (selectedKeys, info) => {
    const byGroup = info?.checkedNodesPositions.filter(
      (i) => i.pos.split("-").length === 2
    );
    if (byGroup.length > 0) {
      if (info?.checked) {
        const filterParentNodes = info?.checkedNodes
          ?.filter((x) => !x.children)
          ?.map((i) => i?.data);
        filterParentNodes?.map((x) => myMap.pin(x));
      } else {
        if (info?.node?.data?.children) {
          myMap.unpin(info?.node?.data?.children?.map((x) => x?.VehicleID));
        } else {
          myMap.unpin(info?.node?.data?.VehicleID);
        }
      }
    } else if (info?.checkedNodes?.length > 0) {
      if (info?.checked) {
        const filterParentNodes = info?.checkedNodes
          ?.filter((x) => !x.children)
          ?.map((i) => i?.data);
        filterParentNodes?.map((x) => myMap.pin(x));
      } else {
        myMap.unpin(info?.node?.data?.VehicleID);
      }
    } else {
      if (!info?.node?.data?.children) {
        myMap.unpin(info?.node?.data?.VehicleID);
      } else {
        myMap.deselectAll(true);
      }
    }
  };

  const groupBy = (arr, key) =>
    arr?.reduce(
      (acc, item) => (
        (acc[item[key]] = [...(acc[item[key]] || []), item]), acc
      ),
      {}
    );

  let groups = groupBy(treeData || [], "GroupName");

  const clientHeight = document.getElementById("widget_menu")?.clientHeight;
  useEffect(() => {
    const setSize = () =>
      clientHeight && setTreeStyleHeight(clientHeight / 1.4);
    window.addEventListener("resize", setSize);
    setSize();
  }, [clientHeight]);

  const handleShowConfigItems = (x, item) => {
    switch (x) {
      case "Speed":
        return (
          <>
            {item["Speed"] ?? 0}{" "}
            <span style={{ fontSize: "0.438rem" }}>km/h</span>
          </>
        );
      case "Mileage":
        return (
          <>
            {item["Mileage"] ?? 0}{" "}
            <span style={{ fontSize: "0.438rem" }}>km</span>
          </>
        );
      case "TotalWeight":
        return (
          <>
            {item["TotalWeight"] ?? 0}{" "}
            <span style={{ fontSize: "0.438rem" }}>kg</span>
          </>
        );
      case "Temp":
        let listOfTemps = [
          item["Temp1"],
          item["Temp2"],
          item["Temp3"],
          item["Temp4"],
        ];
        let listOfFilteredTemps = listOfTemps.filter((item) => item !== 3000);

        if (listOfFilteredTemps.length > 0) {
          let AVGListOfFilteredTemps =
            listOfFilteredTemps.reduce((acc, item) => acc + item, 0) /
            listOfFilteredTemps.length;

          return (
            <>
              {AVGListOfFilteredTemps?.toFixed(1) ?? 0}{" "}
              <span style={{ fontSize: "0.438rem" }}>C</span>
            </>
          );
        } else {
          return "Disconnected";
        }
      case "Humidy":
        let listOfHums = [
          item["Hum1"],
          item["Hum2"],
          item["Hum3"],
          item["Hum4"],
        ];
        let listOfFilteredHums = listOfHums.filter(
          (item) => item >= 1 && item <= 100
        );

        if (listOfFilteredHums.length > 0) {
          let AVGListOfFilteredHums =
            listOfFilteredHums.reduce((acc, item) => acc + item, 0) /
            listOfFilteredHums.length;
          return (
            <>
              {AVGListOfFilteredHums?.toFixed(1) ?? 0}{" "}
              <span style={{ fontSize: "0.438rem" }}>%</span>
            </>
          );
        } else {
          return "Disconnected";
        }
      case "EngineStatus":
        return item["EngineStatus"] == true ? "On" : "Off";

      case "Direction":
        return item["Direction"] !== 0 ? item["Direction"] : "0";
      default:
        return item[x];
    }
  };

  const loop = (data) =>
    data?.map((item, index) => {
      if (item?.children) {
        return (
          <TreeNode
            key={`${item?.title}_${index}`}
            icon={<i className={Styles.cars__icon} />}
            data={item}
            defaultExpandAll={true}
            autoExpandParent={true}
            defaultExpandedKeys={defaultExpandedKeys}
            title={
              <span
                className="d-flex align-items-center"
                style={{ fontSize: "12px" }}
              >
                {item?.title}
                <span className="badge bg-secondary px-1 mx-2">
                  {item?.title === "All"
                    ? treeData?.length
                    : item?.children?.length}
                </span>
              </span>
            }
          >
            {loop(item?.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          className="TreeNode"
          key={item?.SerialNumber}
          data={item}
          style={{ height: "50px" }}
          defaultExpandAll={true}
          autoExpandParent={true}
          defaultExpandedKeys={defaultExpandedKeys}
          icon={
            <div className="position-relative">
              <Image
                src={iconUrl(item?.VehicleStatus)}
                width={11}
                height={20}
                alt={GetStatusString(statusIcons[item?.SerialNumber])}
                title={GetStatusString(statusIcons[item?.SerialNumber])}
              />
            </div>
          }
          isLeaf={true}
          title={
            <div className="d-flex align-items-center flex-column w-100">
              <div className="d-flex align-items-start justify-content-start ">
                {ToggleConfig?.ToggleConfigSettings?.length > 0 &&
                  ToggleConfig?.ToggleConfigSettings?.map((itemToggle, key) => {
                    if (itemToggle.value) {
                      return (
                        <div
                          key={key}
                          className={`me-1 border-bottom ${serialNumberFilter?.length ||
                            addressFilter?.length ||
                            speedFromFilter?.length ||
                            speedToFilter?.length ||
                            displayNameFilter?.length ||
                            plateNumberFilter?.length
                            ? "text-danger"
                            : ""
                            }`}
                          title={Object.values(itemToggle)[0]}
                          style={{
                            fontSize: "10px",
                            overflow: "hidden",
                          }}
                        >
                          ({item[itemToggle.name]} )
                        </div>
                      );
                    }
                  })}
              </div>
              {/* data Icons */}
              <div className="d-flex align-items-center justify-content-between">
                {ToggleConfig?.ToggleConfig &&
                  ToggleConfig?.ToggleConfig?.map((x, key) => {
                    if (x.value) {
                      return (
                        <div key={key}>
                          {handleShowConfigItems(x.name, item) && (
                            <div
                              key={key}
                              title={Object.values(x)[0]}
                              className="fw-bold me-1"
                              style={{
                                fontSize: "11px",
                                backgroundColor: "#246c66",
                                borderRadius: "5px",
                                color: "#fff",
                                minWidth: "30px",
                                textAlign: "center",
                                padding: "0px 8px",
                              }}
                            >
                              {handleShowConfigItems(x.name, item)}
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          }
        />
      );
    });

  return (
    <div className="position-relative">
      <div style={{ minHeight: "100vh", maxWidth: "auto" }} id="menu-scrollbar">
        <div
          className={`tree_root ${darkMode && Styles.dark}`}
          style={{
            height: TreeStyleHeight,
          }}
        >
          <Tree
            checkable
            selectable={false}
            showLine={true}
            defaultExpandAll={true}
            autoExpandParent={true}
            defaultExpandedKeys={defaultExpandedKeys}
            onCheck={onCheck}
            height={TreeStyleHeight}
          >
            {loop(handleGroups(groups))}
          </Tree>
        </div>
      </div>
    </div>
  );
};
export default MenuTree;
