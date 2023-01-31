import React, { useState } from "react";
import {
  ButtonGroup,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
} from "react-bootstrap";

export default function InputsFilter({
  t,
  serialNumberFilter,
  setserialNumberFilter,
  addressFilter,
  setaddressFilter,
  speedFromFilter,
  setspeedFromFilter,
  speedToFilter,
  setspeedToFilter,

  displayNameFilter,
  setDisplayNameFilter,
  plateNumberFilter,
  setPlateNumberFilter,
  ToggleConfigSettings,
}) {
  const [filterBy, setfilterBy] = useState("SerialNumber");

  let listOfFilterMap = [
    "Speed",
    "Address",
    ...ToggleConfigSettings.filter((item) => item.name && item.value).map(
      (item) => item.name
    ),
  ];

  return (
    <>
      <InputGroup>
        {filterBy === "Speed" && (
          <>
            <span className="mt-2 mx-1">{t("from")}</span>
            <FormControl
              dir="auto"
              className="text-start"
              type="number"
              placeholder={`${t("Enter")} ${t(filterBy)}...`}
              value={speedFromFilter}
              onChange={(e) => {
                setspeedFromFilter(e.target.value.trim());
              }}
            />

            <span className="mt-2 mx-1">{t("To")}</span>
            <FormControl
              type="number"
              className="me-2"
              placeholder={`${t("Enter")} ${t(filterBy)}...`}
              value={speedToFilter}
              onChange={(e) => {
                setspeedToFilter(e.target.value.trim());
              }}
            />
          </>
        )}
        {filterBy === "Address" && (
          <FormControl
            type="text"
            value={addressFilter}
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={(e) => {
              setaddressFilter(e.target.value.trim());
            }}
          />
        )}

        {filterBy === "DisplayName" && (
          <FormControl
            type="text"
            value={displayNameFilter}
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={(e) => {
              setDisplayNameFilter(e.target.value.trim());
            }}
          />
        )}

        {filterBy === "PlateNumber" && (
          <FormControl
            type="text"
            value={plateNumberFilter}
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={(e) => {
              setPlateNumberFilter(e.target.value.trim());
            }}
          />
        )}
        {filterBy === "SerialNumber" && (
          <FormControl
            type="number"
            value={serialNumberFilter}
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={(e) => {
              setserialNumberFilter(e.target.value.trim());
            }}
          />
        )}
        <DropdownButton
          as={ButtonGroup}
          // key={Math.random() * 5}
          variant="outline-primary"
          title={t(filterBy)}
          id="input-group-dropdown-4"
          align="end"
          drop={"up"}
        >
          {listOfFilterMap?.map((item, key) => {
            if (filterBy !== item) {
              return (
                <Dropdown.Item
                  onClick={() => {
                    setserialNumberFilter("");
                    setaddressFilter("");
                    setspeedFromFilter("");
                    setspeedToFilter("");
                    setfilterBy(item);
                  }}
                  key={key}
                  href="#"
                  className="bg-soft-primary nav-link py-2"
                >
                  {t(item)}
                </Dropdown.Item>
              );
            }
          })}
        </DropdownButton>
      </InputGroup>
    </>
  );
}
