import { z } from "zod";
import { putColumnKeysNewObj } from "../utils/utils";

export const getMetadataBasedSchema = (
  fields: {
    name: string;
  }[],
  customInputs: {
    [key: string]: z.ZodTypeAny;
  }
) => {
  const newObj: {
    [key: string]: z.ZodTypeAny;
  } = {};

  for (const field of fields) {
    newObj[field.name] = z.string().optional();
  }

  const schema = z
    .object({
      ...newObj,
      ...customInputs,
    })
    .passthrough()
    .transform((obj) => {
      for (const key of Object.keys(obj)) {
        if (obj[key as keyof typeof obj] === "") {
          delete obj[key as keyof typeof obj];
        }
      }
      return obj;
    });

  return schema;
};

export const getItemSchema = (
  fields: {
    name: string;
  }[],
  customInputs: {
    [key: string]: z.ZodTypeAny;
  }
) => {
  const schema = getMetadataBasedSchema(fields, customInputs);

  const transformedSchema = schema.transform((obj) => {
    return {
      board_id: obj.board,
      group_id: obj.group,
      name: obj.name,
      id: obj.id,
      column_values: putColumnKeysNewObj(obj),
    };
  });

  return transformedSchema;
};
