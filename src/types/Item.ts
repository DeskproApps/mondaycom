export interface IGroupItems {
  id: string;
  name: string;
  state: string;
  created_at: string;
  column_values: ColumnValue[];
  workspace: string;
  board: string;
  groups: string;
}

export interface ColumnValue {
  id: string;
  title: string;
  value: string;
  type: string;
}
