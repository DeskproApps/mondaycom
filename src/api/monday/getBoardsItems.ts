import { IBoard } from "../types";
import { IDeskproClient } from "@deskpro/app-sdk";
import getWorkspacesByIds from "./getWorkspacesByIds";
import installedRequest from "../installedRequest";

interface GetBoardItemsParams {
  client: IDeskproClient,
  page: number,
  boardId: string
}

export default async function getBoardsItems(params: GetBoardItemsParams) {
  const { client, page, boardId } = params

  const itemsResponse: { data: { boards: IBoard[] } } = await installedRequest(
    { client, query: getBoardsItemsQuery(page, boardId) }
  );

  const workspaces = await getWorkspacesByIds(
    client,
    itemsResponse.data.boards.map((e) => e.workspace_id) as number[]
  );

  return itemsResponse.data.boards
    .map((board) =>
      board.items_page.items.map((item) => ({
        ...item,
        workspace:
          workspaces.data.workspaces.find((e) => e.id === board.workspace_id)
            ?.name ?? "Main Workspace",
        board: { id: board.id, name: board.name },
        group: item.group,
      }))
    )
    .flat();
}

function getBoardsItemsQuery(page: number, boardId: string) {
  return `
  query {
    boards (ids:${boardId}) {
      id
      workspace_id
      name
      items_page(limit:10){
        cursor
        items{
          id
          name
          state
          created_at
          group{
            id
            title
          }
          board{
            id
            name
          }
          column_values{
            id
            value
            type
            text
          }
          creator{
            name
            id
          }
          updates{
            body
            creator{
              name
              id
            }
            created_at
          }
        }
      }
    }
  }`;
}