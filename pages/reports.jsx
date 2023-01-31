import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Card } from "react-bootstrap";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "styles/Reports.module.scss";
import ReportsOptions from "../components/Reports/ReportsOptions";
// import { empty } from "../lib/slices/vehicleIds";

import { toast } from "react-toastify";
import SideBarReports from "components/Reports/sideBar";
// import TableTaps from "../components/Reports/TableTaps";
// import UseDarkmode from "../hooks/UseDarkmode";

const Reports = () => {
	const { t } = useTranslation("reports");
	const vehicleIds = useSelector((state) => state?.vehicleIds);
	const { darkMode } = useSelector((state) => state.config);


	const [Data_table, setData_table] = useState([]);

	const [reportsOptionsShow, setReportsOptionsShow] = useState(false);
	const [reportTitle, setReportTitle] = useState("");

	const [reportsTitleSelectedId, setReportsTitleSelectedId] = useState(0);
	const [reportApi, setReportApi] = useState("");
	const [reportName, setReportName] = useState("");
	const [reportTabs, setReportTabs] = useState([]);
	const [dateStatus, setDateStatus] = useState("");

	const [reportDateOptions, setReportDateOptions] = useState({
		recordDate1: "",
		recordDate2: "",
		recordDate3: "",
	});

	const [reportsDataSelected, setReportsDataSelected] = useState([]);

	const [reportsTitleSelected, setReportsTitleSelected] = useState("");

	const [loadingShowReport, setLoadingShowReport] = useState(false);
	const [closeAndOpenReportsList, setCloseAndOpenReportsList] = useState(true);

	const [vehiclesError, setVehiclesError] = useState("");
	const [msgTable, setMsgTable] = useState("");

	const [minimumSpeed, setMinimumSpeed] = useState(0);
	const [speedDurationOver, setSpeedDurationOver] = useState(0);
	const [fuelData, setFuelData] = useState(0);
	const [overSpeed, setOverSpeed] = useState(0);
	const [tripDuration, setTripDuration] = useState(false);


	// useEffect(() => {
	// 	if (reportsOptionsShow) {
	// 		document.querySelector(".btn-close").onclick = () =>
	// 			setReportsOptionsShow(false);
	// 	}
	// }, [reportsOptionsShow]);

	// fetch report data
	const fetchData = async (name, api) => {
		let rightApiReports;

		// get last and first date for first report
		let hisF =
			reportDateOptions.recordDate1.length > 0 &&
			reportDateOptions.recordDate1[0].split("T")[0]; // 2022-07-14
		let dateF = new Date(hisF);
		dateF.setDate(dateF.getDate() + 1);
		let dayL = dateF.getDate() > 9 ? dateF.getDate() : `0${dateF.getDate()}`;
		let hisL = `${dateF.getFullYear()}-${dateF.getMonth() + 1 > 9
			? dateF.getMonth() + 1
			: `0${dateF.getMonth() + 1}`
			}-${dayL}`;

		// get last date for most reports
		let FullDateL = new Date();
		let yearL = FullDateL.getFullYear();
		FullDateL.setMonth(FullDateL.getMonth() + 1);
		let MonthL = FullDateL.getMonth();
		let DayL = FullDateL.getDate();
		let LDate = `${yearL}-${MonthL > 9 ? MonthL : `0${MonthL}`}-${DayL > 9 ? DayL : `0${DayL}`
			}`;

		// get first date for most reports
		let FullDateF = new Date();
		let yearF = FullDateF.getFullYear();
		FullDateF.setMonth(FullDateF.getMonth() + 1);
		let MonthF = FullDateF.getMonth();
		FullDateF.setDate(FullDateF.getDate() - 1);
		let DayF = FullDateF.getDate();
		let FDate = `${yearF}-${MonthF > 9 ? MonthF : `0${MonthF}`}-${DayF > 9 ? DayF : `0${DayF}`
			}`;

		let strDate = reportDateOptions.recordDate2
			? reportDateOptions.recordDate2
			: FDate; // recordDate1
		let endDate = reportDateOptions.recordDate3
			? reportDateOptions.recordDate3
			: LDate; // recordDate2

		rightApiReports = `${api}?recordDate1=${strDate}&recordDate2=${endDate}&vehIDs=${vehicleIds}`;

		if (dateStatus === "one") {
			rightApiReports = `${api}?recordDate1=${hisF}&recordDate2=${hisL}&vehIDs=${vehicleIds}`;
		}

		if (fuelData) {
			rightApiReports = `${api}?recordDate1=${strDate}&recordDate2=${endDate}&vehIDs=${vehicleIds}&fuelPrice=${fuelData}`;
		}

		if (overSpeed) {
			rightApiReports = `${api}?recordDate1=${strDate}&recordDate2=${endDate}&vehIDs=${vehicleIds}&speed=${overSpeed}`;
		}

		if (tripDuration) {
			rightApiReports = `${api}?recordDate1=${strDate}&recordDate2=${endDate}&vehIDs=${vehicleIds}&duration=${tripDuration}`;
		}

		if (minimumSpeed && speedDurationOver) {
			rightApiReports = `${api}?strDate=${strDate}&EndDate=${endDate}&vehIDs=${vehicleIds}&speed=${minimumSpeed}&duration=${speedDurationOver}`;
		}

		if (!dateStatus) {
			rightApiReports = `${api}?recordDate1=${strDate}T00:00:00&recordDate2=${endDate}T23:59:59&vehIDs=${vehicleIds}`;
		}
		console.log("rightApiReports => api", rightApiReports);
		return await axios
			.get(`${rightApiReports}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (response.status === 200) {
					if (
						response.data.hasOwnProperty("result") &&
						Array.isArray(response.data?.result)
					) {
						let list = [
							...Data_table,
							{
								id: Math.random().toString(32).substring(3),
								[t(name)]: {
									data: response.data?.result,
								},
							},
						];

						let acurateData_table = new Set([...list]);

						acurateData_table && setData_table([...acurateData_table]);

						// dispatch(empty());

						setMsgTable("");
						return acurateData_table && [...acurateData_table];
					} else {
						let list = [
							...Data_table,
							{
								id: Math.random().toString(32).substring(3),
								[t(name)]: {
									data: [],
								},
							},
						];

						let acurateData_table = new Set([...list]);

						acurateData_table && setData_table([...acurateData_table]);

						// dispatch(empty());

						setMsgTable(response.data?.message);
						return acurateData_table && [...acurateData_table];
					}
				} else {
					toast.error(`Error:  ${response.data?.message}`);
					setMsgTable("");
				}
			})
			.catch((error) => {
				toast.error(error?.response?.data?.message);
			})
			.finally(() => {
				setMinimumSpeed("");
				setSpeedDurationOver("");
				setTripDuration("");
				setOverSpeed("");
				setFuelData("");
				setReportDateOptions({
					recordDate1: "",
					recordDate2: "",
					recordDate3: "",
				});
				hisF = "";
				hisL = "";
				FDate = "";
				LDate = "";
			});
	};

	const ShowReports = (Show, name) => {
		if (Show === "Show") {
			// check if user clicked on the show button
			if (vehicleIds.length > 0) {
				// check if there is a vehicleIds
				setVehiclesError(""); // reset setVehiclesError
				setLoadingShowReport(true); // asign loadingShowReport state to true
				fetchData(name, reportApi) // waiting fetchData to return response
					.then((res) => {
						let lastItem = res[res.length - 1];
						reportTabs.filter((item) => !item.includes(reportTitle)) &&
							setReportTabs([...reportTabs, [lastItem?.id, reportTitle]]);
						setReportsTitleSelected(reportTitle);

						setReportsTitleSelectedId(lastItem?.id);

						let listFilteredKeys = lastItem && Object.keys(lastItem);

						if (lastItem) {
							lastItem[listFilteredKeys[1]]?.data !== undefined &&
								setReportsDataSelected([
									...lastItem[listFilteredKeys[1]]?.data,
								]);
							setReportsTitleSelectedId(lastItem.id);
							setReportsTitleSelected(Object.keys(lastItem)[1]);
						}

						!res?.length > 0 && setReportsDataSelected([]);
					})
					.catch((err) => console.log("error", err))
					.finally(() => {
						setReportsOptionsShow(false);
						setLoadingShowReport(false);
						// dispatch(empty());
						setReportDateOptions({
							recordDate1: "",
							recordDate2: "",
							recordDate3: "",
						});
					});
				// dispatch(empty());
			} else {
				// setVehiclesError(t("Please_Select_At_Least_one_Vehicle"));
				setVehiclesError("Please Select At Least one Vehicle");
			}
		} else {
			setVehiclesError("");
			// dispatch(empty());
		}
	};

	// switching between taps
	const handleTap = (name, id) => {
		// filter Data_table by id
		let listFiltered = Data_table.filter((item) => item.id === id);
		let reportsSelected;
		let reportsSelectedkeys;

		// reset reportsTitleSelectedId to 0
		setReportsTitleSelectedId(0);

		// reset loadingShowReport to false
		setLoadingShowReport(false);

		// check if listFiltered have values
		if (listFiltered.length > 0) {
			// get filtered selected reports
			reportsSelected = [...listFiltered[0][name]?.data];

			// get name of tab
			reportsSelectedkeys = Object.keys(listFiltered[0])[1];

			// add new selected reports's data to setReportsDataSelected
			setReportsDataSelected(reportsSelected);

			// add selected report title to setReportsTitleSelected
			setReportsTitleSelected(reportsSelectedkeys);

			// add selected report id to setReportsTitleSelectedId then return it
			return setReportsTitleSelectedId(listFiltered[0].id);
		}
	};

	// handle icon to open Reports List
	const handleCloseAndOpenReportsList = (status) =>
		setCloseAndOpenReportsList(status);

	const handleCloseTab = (e, id) => {
		e.stopPropagation();

		// filter tabs not match the id
		let reportTabsFiltered = reportTabs.filter((item) => item[0] !== id);

		// re set tabs filtered
		setReportTabs(reportTabsFiltered);

		// filter Data_table with the last reportTabsFiltered tab
		let listFiltered = Data_table.filter((item) => item.id !== id);
		let lastListFiltered = listFiltered[listFiltered.length - 1];
		setData_table(listFiltered);

		// check if listFiltered have elements if yes re set reportsDataSelected state
		// with new value of allData_tableOther filtered
		listFiltered.length > 0
			? setReportsDataSelected(
				lastListFiltered[Object.keys(lastListFiltered)[1]].data
			)
			: setReportsDataSelected([]);

		if (!listFiltered.length > 0) {
			setReportsTitleSelected("");
			return setReportsTitleSelectedId(0);
		}
		// re set target title with new last reportTabsFiltered
		if (reportTabsFiltered[reportTabsFiltered.length - 1]) {
			setReportsTitleSelected(
				reportTabsFiltered[reportTabsFiltered.length - 1][1]
			);
			setReportsTitleSelectedId(
				reportTabsFiltered[reportTabsFiltered.length - 1][0]
			);
		}
	};

	return (
		<>
			<Card style={{ minHeight: "70vh" }}>
				<Card.Body>
					<div className={`position-relative h-100`}>
						<div
							className={`position-absolute ${style.DropdownChild} shadow-sm`}
							style={{
								opacity: closeAndOpenReportsList ? 1 : 0,
								zIndex: closeAndOpenReportsList ? 900 : -1,
								transition: "all 0.5s",
								backgroundColor: darkMode ? '#151824' : 'rgb(235 235 235)'
							}}
						>
							<SideBarReports
								handleCloseAndOpenReportsList={handleCloseAndOpenReportsList}
								reportsTitleSelected={reportsTitleSelected}
								reportName={reportName}
								setReportName={setReportName}
								setReportsOptionsShow={setReportsOptionsShow}
								setReportTitle={setReportTitle}
								setReportApi={setReportApi}
								setDateStatus={setDateStatus}
							/>

							{/* <div className="position-relative">
								<ReportsOptions
									show={reportsOptionsShow}
									onHide={() => setReportsOptionsShow(false)}
									ShowReports={ShowReports}
									reportName={reportName}
									loadingShowReport={loadingShowReport}
									dateStatus={dateStatus}
									setFuelData={setFuelData}
									setOverSpeed={setOverSpeed}
									setVehiclesError={setVehiclesError}
									vehiclesError={vehiclesError}
									setMinimumSpeed={setMinimumSpeed}
									setSpeedDurationOver={setSpeedDurationOver}
									setTripDuration={setTripDuration}
									setReportDateOptions={setReportDateOptions}
									reportDateOptions={reportDateOptions}
								/>
							</div> */}
						</div>
					</div>

					{/* <TableTaps
						reportTabs={reportTabs}
						reportsTitleSelectedId={reportsTitleSelectedId}
						handleTap={handleTap}
						config={config}
						handleCloseTab={handleCloseTab}
						style={style}
						Data_table={Data_table}
						reportsDataSelected={reportsDataSelected}
						msgTable={msgTable}
						reportsTitleSelected={reportsTitleSelected}
					/> */}
				</Card.Body>
			</Card>
			<button
				onClick={() => handleCloseAndOpenReportsList(true)}
				className={`${style.hamburger}`}
				style={{
					opacity: closeAndOpenReportsList ? 0 : 1,
					zIndex: closeAndOpenReportsList ? -1 : 888,
					transition: "all 0.2s",
				}}
			>
				<span className={`${style.hamburger__patty} ${darkMode ? "bg-white" : ""}`} />
				<span className={`${style.hamburger__patty} ${darkMode ? "bg-white" : ""}`} />
				<span className={`${style.hamburger__patty} ${darkMode ? "bg-white" : ""}`} />
			</button>
		</>
	);
};

export default Reports;

// translation ##################################
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["reports", "main"])),
		},
	};
}
// translation ##################################
