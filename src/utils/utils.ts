import { FieldMappingInputs } from "../types/types";

export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectValue = (obj: any, keyString: string) => {
  const keys = keyString.split(".");

  let value = obj;

  for (const key of keys) {
    value = value[key];

    if (value === undefined) {
      return undefined;
    }
  }

  return value;
};

export const makeFirstLetterUppercase = (str: string) => {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function createObjectWithoutKeys(
  originalObject: Record<string, string>,
  keysToExclude: string[]
) {
  const newObject: Record<string, string> = {};

  for (const key in originalObject) {
    if (
      !keysToExclude.includes(key) &&
      !(key === "workspace" && originalObject[key] == null)
    ) {
      newObject[key] = originalObject[key];
    }
  }

  return newObject;
}

export const substitutePlaceholders = (
  string: string,
  obj: Record<string, string>
) => {
  for (const [key, value] of Object.entries(obj)) {
    string = string.replace(new RegExp(`__${key}__`, "g"), value);
  }
  return string;
};

export const getDropdownDataForObject = (
  data: FieldMappingInputs,
  outsideData: {
    [key: string]: {
      key: string;
      value: string;
    }[];
  }
) => {
  return data.reduce(
    (
      acc: Record<
        string,
        {
          key: string;
          value: string;
        }[]
      >,
      curr: FieldMappingInputs[0]
    ) => {
      switch (curr.type) {
        case "color":
          acc[curr.name] = Object.entries(
            JSON.parse(curr.settings_str ?? "{}").labels
          ).map((setting) => ({
            key: setting[1] as string,
            value: setting[0].toString(),
          }));

          break;
        case "dropdown":
          acc[curr.name] = JSON.parse(curr.settings_str ?? "{}").labels.map(
            (setting: { name: string; id: number }) => ({
              key: setting.name,
              value: setting.id,
            })
          );

          break;
        case "users":
          acc[curr.name] = outsideData.users;

          break;
      }

      return acc;
    },
    {}
  );
};

export const putColumnKeysNewObj = (
  data: Record<string, string | string[]>
) => {
  const newObject: Record<
    string,
    | string
    | string[]
    | Record<string, string[] | { id: string; kind: string }[]>
  > = {};

  // Loop through the keys in the original object
  for (const key in data) {
    if (key.startsWith("column_data_")) {
      // If the key ends with "_column_key", move it to the new object
      if (key.includes("dropdown")) {
        newObject[key.replace("column_data_", "")] = {
          ids: data[key] as string[],
        };
      } else if (key.includes("person")) {
        newObject[key.replace("column_data_", "")] = {
          personsAndTeams: (data[key] as string[]).map((e: string) => ({
            id: e,
            kind: "person",
          })),
        };
      } else {
        newObject[key.replace("column_data_", "")] = data[key];
      }
      // Remove the key from the original object
      delete data[key];
    }
  }

  return newObject;
};
