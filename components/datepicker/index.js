import React, { useState } from "react";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";

export const Datepicker = ({ handleDate, t, className, ...res }) => {
  const [dateRange, setDateRange] = useState(new Date());
  return (
    <DatePicker
      className={`w-75 ${className}`}
      selected={dateRange}
      // endDate={endDate}
      onChange={(update) => {
        setDateRange(update);
        handleDate(update);
      }}
      showPopperArrow={false}
      monthsShown={1}
      placeholderText={t("select_date_range_key")}
      dateFormat={"yyyy-MM-dd"}
      maxDate={new Date()}
      {...res}
    // todayButton="Today"
    />
  );
};
export const DatepickerMulti = ({ handleDate, t, className, ...res }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  return (
    <DatePicker
      className={`w-75 ${className}`}
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        setDateRange(update);
        handleDate(update)
      }}
      selectsRange
      showPopperArrow={false}
      monthsShown={2}
      placeholderText={t("select_date_key")}
      dateFormat={"yyyy-MM-dd"}
      maxDate={new Date()}
      {...res}
    // todayButton="Today"
    />
  );
};
