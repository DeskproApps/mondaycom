import { IBoard, ItemBoard } from "../types";
import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";

export default async function editItem(
  client: IDeskproClient,
  data: {
    board: ItemBoard;
    id: string;
    name: string;
    column_values: Record<string, string>;
  }
): Promise<{ data: { boards: IBoard[] } }> {
  return await installedRequest({ client, query: editItemQuery(data) });
};

function editItemQuery(data: {
  board: ItemBoard;
  id: string;
  name: string;
  column_values: Record<string, string>;
}) {
  return `
  mutation {
    change_multiple_column_values(
      board_id: ${data.board.id},
      item_id: ${data.id},
      column_values: "${JSON.stringify({
    ...data.column_values,
    name: data.name,
  }).replaceAll(`"`, `\\"`)}"
    ) {
      id
    }
  }`;
}