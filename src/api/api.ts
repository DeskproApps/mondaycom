import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import {
  createItemQuery,
  createNoteQuery,
  editItemQuery,
  getBoardColumnsQuery,
  getBoardsItemsQuery,
  getBoardsQuery,
  getGroupsByBoardIdQuery,
  getItemsByIdQuery,
  getItemsByPromptBoardIdQuery,
  getUsersByIdQuery,
  getUsersQuery,
  getWorkspaceNamesByIdsQuery,
  getWorkspacesQuery,
} from "./queries";
import { BoardColumns, IBoard, IItem, ItemBoard, IWorkspaces } from "./types";

export const getUsers = async (
  client: IDeskproClient
): Promise<{
  data: {
    users: {
      id: string;
      name: string;
    }[];
  };
}> => {
  return await installedRequest(client, getUsersQuery());
};

export const getUsersById = async (
  client: IDeskproClient,
  ids: string[]
): Promise<{
  data: {
    users: {
      id: string;
      name: string;
    }[];
  };
}> => {
  return await installedRequest(client, getUsersByIdQuery(ids));
};

export const getBoardColumns = async (
  client: IDeskproClient,
  boardId: string
): Promise<{ data: BoardColumns }> => {
  return await installedRequest(client, getBoardColumnsQuery(boardId));
};

export const getItemsByPromptBoardId = async (
  client: IDeskproClient,
  boardId: string,
  prompt: string
): Promise<{ data: { boards: IBoard[] } }> => {
  return await installedRequest(
    client,
    getItemsByPromptBoardIdQuery(boardId, prompt),
    {
      "API-Version": "2023-10",
    }
  );
};

export const editItem = async (
  client: IDeskproClient,
  data: {
    board: ItemBoard;
    id: string;
    name: string;
    column_values: Record<string, string>;
  }
): Promise<{ data: { boards: IBoard[] } }> => {
  return await installedRequest(client, editItemQuery(data));
};

export const createNote = async (
  client: IDeskproClient,
  item_id: string,
  body: string
) => {
  return await installedRequest(client, createNoteQuery(item_id, body));
};

export const getGroupsByBoardId = async (
  client: IDeskproClient,
  boardId: number
) => {
  return await installedRequest(client, getGroupsByBoardIdQuery(boardId));
};

export const getBoardsByWorkspaceId = async (
  client: IDeskproClient,
  selectedWorkspace?: string | number | null
): Promise<{ data: { boards: IBoard[] } }> => {
  return await installedRequest(
    client,
    getBoardsQuery(selectedWorkspace),
    selectedWorkspace
      ? {
          "API-Version": "2023-10",
        }
      : undefined
  );
};

export const createItem = async (
  client: IDeskproClient,
  data: {
    board_id: string;
    id: string;
    name: string;
    column_values: Record<string, string>;
  }
) => {
  return await installedRequest(client, createItemQuery(data));
};

export const getItemsById = async (
  client: IDeskproClient,
  items: string[]
): Promise<IItem[]> => {
  const itemsResponse: { data: { items: IItem[] } } = await installedRequest(
    client,
    getItemsByIdQuery(items)
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
};

export const getWorkspaces = async (
  client: IDeskproClient
): Promise<{
  data: {
    workspaces: IWorkspaces[];
  };
}> => {
  return await installedRequest(client, getWorkspacesQuery());
};

export const getWorkspacesByIds = async (
  client: IDeskproClient,
  ids: number[]
): Promise<{
  data: { workspaces: IWorkspaces[] };
}> => {
  return installedRequest(client, getWorkspaceNamesByIdsQuery(ids));
};

export const getBoardsItems = async (
  client: IDeskproClient,
  page: number,
  boardId: string
): Promise<IItem[]> => {
  const itemsResponse: { data: { boards: IBoard[] } } = await installedRequest(
    client,
    getBoardsItemsQuery(page, boardId)
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
        board: {id: board.id,name: board.name},
        group: item.group,
      }))
    )
    .flat();
};

const installedRequest = async (
  client: IDeskproClient,
  query: string,
  headers?: Record<string, string>
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "__access_token__",
      ...headers,
    },
    body: JSON.stringify({ query: query.replaceAll("\n", "") }),
  };

  const response = await fetch(`https://api.monday.com/v2`, options);

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(
      json.errors.reduce(
        (a: string, c: { message: string }) => a + c.message + "\n",
        ""
      )
    );
  }

  return json;
};

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
