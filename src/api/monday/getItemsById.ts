import { IDeskproClient } from "@deskpro/app-sdk";
import { IItem } from "../types";
import getWorkspacesByIds from "./getWorkspacesByIds";
import installedRequest from "../installedRequest";

export default async function getItemsById(client: IDeskproClient, items: string[]): Promise<IItem[]> {
    const itemsResponse: { data: { items: IItem[] } } = await installedRequest(
        {
            client,
            query: getItemsByIdQuery(items)
        }
    );

    const workspaces = await getWorkspacesByIds(
        client,
        itemsResponse.data.items.map((e) => e.workspace_id) as number[]
    );

    return itemsResponse.data.items
        .map((item) => ({
            ...item,
            workspace:
                workspaces.data.workspaces.find((e) => e.id === item.workspace_id)
                    ?.name ?? "Main Workspace",
            workspace_id: item.workspace_id,
            board: {
                id: item.board.id,
                name: item.board.name
            },
            group: item.group,
        })

        )
        .flat();
}

function getItemsByIdQuery(ids: string[]) {
    return `
    query {
      items (ids:[${ids}]) {
        id
        name
        state
        created_at
        group {
          id
          title
        }
        board {
          id
          name
        }
        column_values {
          id
          value
          type
          text
        }
        creator {
          name
          id
        }
        updates {
          body
          creator {
            name
            id
          }
          created_at
        }
      }
    }`;
  }
  