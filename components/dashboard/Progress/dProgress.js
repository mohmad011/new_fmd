import React from "react";
//Count-up
import { CountUp } from "use-count-up";
//progressbar
import Progress from "./progress";
// translation
import { useTranslation } from "next-i18next";

const DProgress = ({
  name = ["one"],
  countStart = [0],
  countEnd = [20],
  duration = 1,
  dateType,
  progresCount,
  color = "primary",
  minvalue = 0,
  maxvalue = 100,
}) => {
  const { t } = useTranslation("dashboard");
  return (
    <>
      <div className="d-flex justify-content-between">
        {name?.map((ele, i) => (
          <div key={i}>
            <span>
              <b>{t(ele)}</b>
            </span>
            <div className="mt-2">
              <h2 className="counter">
                <CountUp
                  isCounting
                  start={countStart[i]}
                  end={countEnd[i]}
                  duration={duration}
                />
              </h2>
            </div>
          </div>
        ))}
        <div>
          <span
            className={`badge bg-${color} p-2`}
            style={{ letterSpacing: "1.2px" }}
          >
            {dateType}
          </span>
        </div>
      </div>
      {progresCount && (
        <div>
          <div className="d-flex justify-content-between mt-2">
            <div>
              <span>{t("percentage_key")}</span>
            </div>
            <div>
              {/* <span>{!loading && `${progresCount}%`}</span> */}
              <CountUp
                isCounting
                end={+progresCount || 0}
                duration={duration}
              />
              %
            </div>
          </div>
          <div className="mt-3">
            <Progress
              softcolors={color}
              color={color}
              value={+progresCount}
              minvalue={minvalue}
              maxvalue={maxvalue}
              className="shadow-none w-100"
              style={{ height: "6px" }}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default DProgress;
