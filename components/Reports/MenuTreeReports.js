import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config/config";
import Tree, { TreeNode } from "rc-tree";
import Image from "next/image";
import "rc-tree/assets/index.css";
import Styles from "../../styles/Tree.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  SyncOnPopupCheck,
  SyncOnExpand,
} from "../../lib/slices/vehicleProcessStatus";
import {
  filterBySerialNumber,
  GetStatusString,
  iconUrl,
} from "../../helpers/helpers";
import { decrypt, encryptName } from "../../helpers/encryptions";
import { add, empty } from "../../lib/slices/vehicleIds";

const MenuTreeReports = ({ setVehiclesError, treeFilter }) => {
  const [lists, setLists] = useState([]);
  const [statusIcons, setStatusIcons] = useState({});
  const [TreeStyleHeight, setTreeStyleHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [popupData, setPopupData] = useState();
  const [TreeNum, setTreeNum] = useState(0);
  const dispatch = useDispatch();

  const groupBy = (arr, key) =>
    arr?.reduce(
      (acc, item) => (
        (acc[item[key]] = [...(acc[item[key]] || []), item]), acc
      ),
      {}
    );

  useEffect(() => {
    // let _USER_VEHICLES_POPUP =
    //   JSON.parse(localStorage.getItem("userData")) ?? [];
    // // encryptName;

    let { vehData } =
      JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") ?? [];

    console.log("vehData", vehData);

    let groups = groupBy(vehData || [], "GroupName");
    let groupsLen = 0;
    let AllGroups = Object.values(groups);
    AllGroups?.map((item) => {
      groupsLen += item.length;
    });
    setTreeNum(groupsLen);

    if (groups) {
      var all = { all: groups };
    }

    if (groups["Default"]) {
      groups["Default"] = [...groups["Default"]];
      groups["Un Group"] = [...groups["null"]];
    } else if (groups["null"]) {
      groups["ungroup"] = [...groups["null"]];
    }
    delete groups["null"];
    let result = [];
    result.push({
      title: "All",
      children: [groups],
    });
    for (let key in result[0]?.children[0])
      if (result[0]?.children[0]?.hasOwnProperty(key))
        result[0]?.children?.push({
          title: key,
          children: result[0]?.children[0][key],
        });
    result[0]?.children.splice(0, 1);

    // const allBadgeArr = result[0]?.children?.map((i) => i?.children?.length);
    // const allBadgeCount = allBadgeArr?.reduce(
    //   (sum, current) => sum + current,
    //   0
    // );
    // setTreeNum(allBadgeCount);

    if (treeFilter.length > 0 && result.length > 0) {
      const results = filterBySerialNumber(result, treeFilter);

      let resultsF = results?.map((item) => {
        return item?.children.filter((itemF) => itemF.highlight);
      });
      results?.map((item, index) => {
        item.children = resultsF[index];
      });
      console.log("result if treeFilter", result);
      lists[0].children = results;

      return setLists(lists);
    }
    setLists(result);
  }, [treeFilter]);

  const stateReducer = useSelector((state) => state);
  useEffect(() => {
    window.document.querySelector(".rc-tree-list-holder").style.overflow =
      "hidden";
  }, []);
  useEffect(
    (_) => {
      const fetchData = async () => {
        const response = await axios.get(
          `${config.apiGateway.URL}vehicles/settings`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 && response.data?.length > 0) {
          const result = response.data.filter((SN) => SN.SerialNumber !== null);
          result?.map((x) => {
            var config = Object.assign({}, locConfigModel);
            Object.assign(config, x);
            config.MinVoltage = locConfigModel.MinVolt;
            config.MaxVoltage = locConfigModel.MaxVolt;
            config.RecordDateTime = Date2KSA(config.RecordDateTime);
            Object.assign(x, config);
          });
          setPopupData([...result]);
        } else {
          console.error("error");
        }
      };

      const ele = document.getElementById("widget_menu");
      const setSize = () => ele && setTreeStyleHeight(ele.clientHeight / 1.3);
      window.addEventListener("resize", setSize);
      setLoading(true);
      setSize();

      // let _USER_VEHICLES_POPUP =
      //   JSON.parse(localStorage.getItem(encryptName("user_vehicles"))) ?? {};

      let { vehData } =
        JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") ?? [];

      let groups = groupBy(popupData ? popupData : vehData, "GroupName");

      let groupsLen = 0;
      let AllGroups = Object.values(groups);
      AllGroups?.map((item) => {
        groupsLen += item.length;
      });
      setTreeNum(groupsLen);
      if (groups) {
        var all = { all: groups };
      }

      if (groups["Default"]) {
        groups["Default"] = [...groups["Default"]];
        groups["Un Group"] = [...groups["null"]];
      } else if (groups["null"]) {
        groups["ungroup"] = [...groups["null"]];
      }
      delete groups["null"];
      let result = [];
      result.push({
        title: "All",
        children: [groups],
      });
      for (let key in result[0]?.children[0]) {
        if (result[0]?.children[0]?.hasOwnProperty(key))
          result[0]?.children?.push({
            title: key,
            children: result[0]?.children[0][key],
          });
      }

      result[0]?.children?.splice(0, 1);
      setLists(result);

      // dispatch(addData(result[0]));

      setStatusIcons(stateReducer?.firebase?.status);

      token && fetchData();
    },
    [popupData, token, stateReducer?.firebase?.status]
  );

  const onCheck = (selectedKeys, info) => {
    const byGroup = info.checkedNodesPositions.filter(
      (i) => i.pos.split("-").length === 2
    );

    if (byGroup.length > 0) {
      dispatch(SyncOnPopupCheck(byGroup[byGroup.length - 1].node.children));
      // console.log("1");
      byGroup[byGroup.length - 1].node.children?.map((itemParent1) => {
        itemParent1.children?.map((itemParent2) => {
          dispatch(add(itemParent2.data.VehicleID));
        });
      });
      setVehiclesError("");
      // console.log("info", info);
    } else if (info.checkedNodes.length > 0) {
      dispatch(SyncOnPopupCheck(info?.checkedNodes));
      // console.log("2", info?.checkedNodes);
      dispatch(empty());
      info?.checkedNodes?.map((itemParent1) => {
        if (!itemParent1.hasOwnProperty("children")) {
          dispatch(add(itemParent1.data.VehicleID));
        }
      });
      setVehiclesError("");
    } else {
      dispatch(SyncOnPopupCheck([]));
      dispatch(empty());
      console.log("3");
    }
  };

  const onExpand = (expandedKeys, info) => {
    if (expandedKeys.length > 0) {
      dispatch(SyncOnExpand(info.node.children));
    } else {
      dispatch(SyncOnExpand([]));
    }
  };

  const handleFilterTree = (treeNode) => {
    if (treeFilter) {
      // if not group
      if (!Array.isArray(treeNode.title.props.children)) {
        return;
      }
      return treeNode.key.toLocaleLowerCase().startsWith(treeFilter);
    }
  };

  const loop = (data) =>
    data?.map((item, index) => {
      if (item?.children) {
        // console.log("item", item);
        return (
          <TreeNode
            key={`${item?.title}_${index}`}
            icon={<i className={Styles.cars__icon} />}
            data={item}
            title={
              <span
                className="d-flex align-items-center"
                style={{ fontSize: "12px" }}
              >
                {item?.title}
                <span className="badge bg-secondary px-1 mx-2">
                  {item?.title === "All" ? TreeNum : item.children?.length}
                </span>
              </span>
            }
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          className="foo"
          key={item?.SerialNumber}
          data={item}
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
            <div className="d-flex align-items-center">
              <div
                className="me-1"
                title={item?.DisplayName}
                style={{ fontSize: "10px" }}
              >
                {item?.DisplayName}
              </div>

              <div
                title={item?.DisplyName}
                className="fw-bold me-1"
                style={{ fontSize: "11px" }}
              >
                ({item?.SerialNumber})
              </div>
            </div>
          }
        />
      );
    });

  return (
    <div className="position-relative">
      <div style={{ minHeight: "25vh", maxWidth: "auto" }} id="menu-scrollbar">
        <div
          className={`tree_root ${stateReducer.config.darkMode && Styles.dark}`}
          style={{ height: TreeStyleHeight }}
        >
          <Tree
            selectable={false}
            showLine
            checkable
            onCheck={onCheck}
            onExpand={onExpand}
            onActiveChange={(key) => console.log(key, "change")}
            defaultExpandedKeys={["0-0-0", "0-0-1"]}
            defaultSelectedKeys={["0-0-0", "0-0-1"]}
            defaultCheckedKeys={["0-0-0", "0-0-1"]}
            virtual={true}
            filterTreeNode={handleFilterTree}
            height={TreeStyleHeight - 80}
            className=""
          >
            {loop(lists)}
          </Tree>
        </div>
      </div>
    </div>
  );
};
export default MenuTreeReports;
