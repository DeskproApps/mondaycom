import { ReactElement } from "react";
import { IItem } from "../api/types";
import { CustomTag } from "../components/CustomTag/CustomTag";
import { IJson } from "../types/json";
import { formatDate } from "../utils/dateUtils";
import { getObjectValue, makeFirstLetterUppercase } from "../utils/utils";

export const useMapFieldValues = () => {
  const mapFieldValues = (
    metadataFields: IJson["list"][0] | IJson["view"][0],
    field: IItem
  ) => {
    return metadataFields.map((metadataField) => {
      let value;
      switch (metadataField.type) {
        case "date":
          value = formatDate(
            new Date(field[metadataField.name as keyof IItem] as string)
          );

          break;

        case "column_value":
          if (!field[metadataField.name as keyof IItem]) break;

          value = field[metadataField.name as keyof IItem];

          break;

        case "column_values": {
          value = "column_values";

          break;
        }

        case "label": {
          value = (
            <CustomTag
              title={makeFirstLetterUppercase(
                field[metadataField.name as keyof IItem] as string
              )}
            ></CustomTag>
          );

          break;
        }

        case "key":
          value = getObjectValue(field, metadataField.name);

          break;

        case "itemKey": {
          if (
            (field[metadataField.name as keyof IItem] as string).includes(
              "REDACTED"
            )
          )
            break;

          value = field[metadataField.name as keyof IItem];

          break;
        }

        case "itemNumber":
          value = `#${field[metadataField.name as keyof IItem]}`;

          break;

        case "text-column_values":
        case "text":
          value = makeFirstLetterUppercase(
            field[metadataField.name as keyof IItem]?.toString() as string
          );

          break;

        default:
          value = undefined;
      }

      return {
        key: metadataField.label,
        value: value as string | number | ReactElement | undefined,
      };
    });
  };

  return { mapFieldValues };
};
