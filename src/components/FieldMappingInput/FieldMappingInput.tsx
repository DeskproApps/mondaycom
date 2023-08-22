/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import { FieldErrorsImpl } from "react-hook-form";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form/dist/types";

import { DropdownData, FieldMappingInputs } from "../../types/types";
import { DateField } from "../DateField/DateField";
import { DropdownSelect } from "../DropdownSelect/DropdownSelect";
import { InputWithTitleRegister } from "../InputWithTitle/InputWithTitleRegister";

type Props = {
  errors: Partial<FieldErrorsImpl<any>>;
  fields: FieldMappingInputs;
  dropdownData?: DropdownData;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  onDropdownChange?: (
    key: string,
    value: string,
    action: "add" | "remove"
  ) => void;
};
export const FieldMappingInput = forwardRef(
  ({
    fields,
    errors,
    watch,
    setValue,
    register,
    dropdownData,
    onDropdownChange,
    ...attributes
  }: Props) => {
    return fields.map((field) => {
      if (field.label === "Type") return false;

      switch (field.type) {
        case "text":
        case "numeric":
          return (
            <InputWithTitleRegister
              register={register(field.name, {
                setValueAs: (value) => {
                  if (value === "") return undefined;

                  if (field.type === "numeric") return Number(value);

                  return value;
                },
              })}
              title={field.label}
              error={!!errors[field.name]}
              type={field.type === "numeric" ? "number" : "text"}
              required={field.required}
              data-testid={`input-${field.name}`}
              {...attributes}
            ></InputWithTitleRegister>
          );
        case "users":
        case "color":
        case "dropdown": {
          if (!dropdownData) return null;

          return (
            <DropdownSelect
              title={field.label}
              error={!!errors[field.name]}
              required={field.required}
              data={dropdownData[field.name]}
              onChange={(e) => setValue(field.name, e)}
              value={watch(field.name)}
              multiple={field.multiple}
            />
          );
        }
        case "date":
          return (
            <DateField
              style={
                !!errors?.[field.name] && {
                  borderBottomColor: "red",
                }
              }
              value={watch(field.name)}
              label={field.label}
              error={!!errors[field.name]}
              onChange={(e: [Date]) =>
                setValue(field.name, e[0].toISOString().split("T")[0])
              }
            />
          );
      }
      return null;
    });
  }
);
