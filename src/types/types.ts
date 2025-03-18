export type DropdownData = {
  [key: string]: {
    key: string;
    value: string;
  }[];
};

export type FieldMappingInputs = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  multiple?: boolean;
  settings_str?: string;
}[];
