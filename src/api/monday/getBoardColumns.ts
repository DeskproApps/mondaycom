import { BoardColumns } from "../types";
import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";

export default async function getBoardColumns(
  client: IDeskproClient,
  boardId: string
): Promise<{ data: BoardColumns }> {
  return await installedRequest({ client, query: getBoardColumnsQuery(boardId) });
};


function getBoardColumnsQuery(board_id?: number | string) {
  return `
  query {
    boards ${board_id ? `(ids:${board_id})` : ""} {
      columns {
        id
        title
        settings_str
        description
        type
      }
    }
  }`;
}