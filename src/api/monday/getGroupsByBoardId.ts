import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";

export default async function getGroupsByBoardId(
  client: IDeskproClient,
  boardId: number
) {
  return await installedRequest({ client, query: getGroupsByBoardIdQuery(boardId) });
};

function getGroupsByBoardIdQuery(boardId: number) {
  return `
  query {
    boards (${boardId ? `ids:[${boardId}]` : ""}) {
      groups {
        id
        title
      }
    }
  }`;
}
