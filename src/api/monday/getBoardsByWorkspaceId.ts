import { IBoard } from "../types";
import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";


export default async function getBoardsByWorkspaceId(
  client: IDeskproClient,
  selectedWorkspace?: string | number | null
): Promise<{ data: { boards: IBoard[] } }> {
  return await installedRequest({
    client,
    query: getBoardsQuery(selectedWorkspace),
    headers: selectedWorkspace
      ? {
        "API-Version": "2023-10",
      }
      : undefined
  }
  );
}

function getBoardsQuery(selectedWorkspace?: string | number | null) {
  return `
  query {
    boards ${selectedWorkspace ? `(workspace_ids: [${selectedWorkspace}])` : ``} {
      id
      name
      workspace_id
      groups {
        id
        title
      }
    }
  }`;
}