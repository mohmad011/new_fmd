import * as Yup from "yup";

const numberValidation = (inputName, required, mustNumber) => {
  return Yup.number()
    .required(`${inputName} ${required}`)
    .typeError(`${inputName} ${mustNumber}`);
};

const stringValidation = (inputName, required) => {
  return Yup.string().required(`${inputName} ${required}`).trim();
};

export const vehicleDataValidation = (wirteInOptional, t) => {
  const required = t("is_required_key");
  const mustNumber = t("must_be_number_key");

  return Yup.object().shape({
    DisplayName: stringValidation(t("display_name_key"), required),
    PlateNumber: stringValidation(t("plate_number_key"), required),
    MakeYear: numberValidation(
      t("manufacturing_year_key"),
      required,
      mustNumber
    )
      .min(
        1800,
        t("manufacturing_year_must_be_greater_than_or_equal_to_1800_key")
      )
      .max(
        2200,
        t("manufacturing_year_must_be_less_than_or_equal_to_2200_key")
      ),
    SpeedLimit: Yup.number().min(
      0,
      t("speed_limit_must_be_greater_than_or_equal_to_0_key")
    ),
    LiterPer100KM: Yup.number().min(
      0,
      t("liter_per_100KM_must_be_greater_than_or_equal_to_0_key")
    ),
    Number: wirteInOptional ? stringValidation(t("number_key"), required) : "",
    RightLetter: wirteInOptional
      ? stringValidation(t("right_letter_key"), required)
      : "",
    MiddleLetter: wirteInOptional
      ? stringValidation(t("middle_letter_key"), required)
      : "",
    LeftLetter: wirteInOptional
      ? stringValidation(t("left_letter_key"), required)
      : "",
    SequenceNumber: wirteInOptional
      ? stringValidation(t("sequence_number_key"), required)
      : "",
    PlateType: wirteInOptional
      ? numberValidation(t("plate_type_key"), required, mustNumber).min(
          0,
          t("plate_type_must_be_greater_than_or_equal_to_0_key")
        )
      : "",
    ImeiNumber: wirteInOptional
      ? stringValidation(t("IMEI_number_key"), required)
      : "",
  });
};

export const vehicleAddDevice = (t) => {
  const required = t("is_required_key");
  return Yup.object().shape({
    serialNumber: stringValidation(t("serial_number_key"), required),
  });
};

export const vehicleAddSim = (t) => {
  const required = t("is_required_key");

  return Yup.object().shape({
    simSerialNumber: stringValidation(t("serial_number_key"), required),
    phoneNumber: stringValidation(t("phone_number_key"), required),
  });
};

export const vehicleAddGroup = (t) => {
  return Yup.object().shape({
    MaxParkingTime: Yup.number().min(
      0,
      t("maximum_parking_time_must_be_greater_than_or_equal_to_0_key")
    ),
    MaxIdlingTime: Yup.number().min(
      0,
      t("maximum_idling_time_must_be_greater_than_or_equal_to_0_key")
    ),
  });
};
