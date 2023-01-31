import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Collapse, FormControl } from "react-bootstrap";
import data from "public/reportsOptions.json";
import style from "styles/Reports.module.scss";
import Image from "next/image";
import { filterByNames } from "helpers/helpers";

const SideBarReports = ({
  handleCloseAndOpenReportsList,
  reportsTitleSelected,

  setReportName,
  setReportsOptionsShow,
  setReportTitle,
  setReportApi,
  setDateStatus,
}) => {
  const { t } = useTranslation("reports");
  const reportsData = data[0].reportsData;
  const [filterInput, setfilterInput] = useState("");
  const [idCollapse, setIdCollapse] = useState(0);

  const handleReportsOptionsShow = (e, api, name, dateStatus) => {
    setReportName(name);
    setReportsOptionsShow(true);
    setReportTitle(e.target.textContent);
    setReportApi(api);
    setDateStatus(dateStatus);
  };




  const filterdData = useMemo(() => {
    if (!filterInput) {
      return reportsData
    }
    return filterByNames(t,reportsData, filterInput)
  }, [filterInput, reportsData,t]);


  const handleIdCollapse = (id) => {
    if (idCollapse == id) {
      setfilterInput("");
      setIdCollapse(0);
    } else {
      setIdCollapse(id);
    }
  };

  // functions for UI
  const handleIconImg = (imgGreen, imgWhite, styleIcon, id) =>
    imgGreen && imgWhite && idCollapse === id ? (
      <Image
        width={12}
        height={12}
        src={imgWhite}
        alt=""
        className={`${styleIcon}`}
      />
    ) : (
      <Image
        width={12}
        height={12}
        src={imgGreen}
        alt=""
        className={`${styleIcon}`}
      />
    );

  const handleIcon = (id) => (idCollapse === id ? "" : "text-primary");
  const handleTitleItem = (id) =>
    idCollapse === id ? "" : "text-secondary";
  const handleAngleIcon = (id) =>
    idCollapse === id ? (
      <i className="fa fa-angle-up" aria-hidden="true"></i>
    ) : (
      <i className="fa fa-angle-down text-primary" aria-hidden="true"></i>
    );

  const handleIdCollapseBtn = (id) =>
    idCollapse === id
      ? "bg-primary"
      : "bg-transparent text-dark border-0";

  const handleCollapse = (id, highlight) => (idCollapse === id) || highlight;

  return (
    <>
      <Button className="bg-primary p-2 border-0 w-100">
        <div className="d-flex align-items-center">
          <div
            className={`${style.bxIconTitle} d-flex align-items-center justify-content-center gap-1 w-100 text-light`}
          >
            <span className="icon ">
              <Image
                width={16}
                height={16}
                src="/assets/images/icons/file-spreadsheet.2.svg"
                alt=""
                className={`${style.icon}`}
              />
            </span>
            <span className="title text-center">{t("Reports_List_key")}</span>
          </div>
          <span
            onClick={() => handleCloseAndOpenReportsList(false)}
            className={`${style.close} align-items-center text-right text-light d-flex justify-content-center`}
          >
            <div className={`${style.closeBtn} ${style.active}`}>
              <span className={style.closeBtn__patty} />
              <span className={style.closeBtn__patty} />
              <span className={style.closeBtn__patty} />
            </div>
          </span>
        </div>
      </Button>
      <div className="input-group mt-3 mb-3">
        <FormControl
          type="text"
          placeholder={`${t("search_key")}`}
          value={filterInput}
          onChange={(e) => {
            setfilterInput(e.target.value);
          }}
        />
      </div>
      {filterdData?.map((item, key) => (
        <>
          <Button
            key={key}
            onClick={() => handleIdCollapse(item?.id)}
            aria-controls="example-collapse-text"
            aria-expanded={handleCollapse(item?.id, filterInput ? true : false)}
            className={` w-100 d-flex justify-content-between p-2 mb-3 ${handleIdCollapseBtn(item?.id)} list-title-btn`}
          >
            <div className=" d-flex">
              <div className={`${handleIcon(item?.id)} pe-2`}>
                {item?.imgGreen &&
                  item?.imgWhite &&
                  handleIconImg(
                    item?.imgGreen,
                    item?.imgWhite,
                    style.icon,
                    item?.id
                  )}
              </div>
              <h6 className={`${handleTitleItem(item?.id)}`}>
                {t(item?.title)}
              </h6>
            </div>
            <span>{handleAngleIcon(item?.id)}</span>
          </Button>
          <Collapse in={handleCollapse(item?.id, filterInput ? true : false)}>
            <div id="example-collapse-text">
              <div className={`d-flex flex-column ${style.bxLinks}`}>
                {item?.subTitle?.map((item, key) => (
                  <button
                    key={key}
                    onClick={(e) =>
                      handleReportsOptionsShow(
                        e,
                        item.api,
                        item.name,
                        item.dateStatus
                      )
                    }
                    className={`border-0 d-flex text-secondary align-items-center  ${style.ReportsTitle}`}
                  >
                    <i
                      className={`fa fa-angle-double-right ${t(reportsTitleSelected) === t(item.name) &&
                        "text-primary"
                        } ${item.highlight && "text-primary "}`}
                      aria-hidden="true"
                    ></i>
                    <span
                      className={`${t(reportsTitleSelected) === t(item.name) &&
                        "text-primary fw-bold"
                        } ${item.highlight && "text-primary fw-bold"}`}
                    >
                      {t(item.name)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Collapse>
        </>
      ))}
    </>
  );
};

export default SideBarReports;
