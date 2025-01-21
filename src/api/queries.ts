
export const getBoardsItemsQuery = (page: number, boardId: string) => `
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
}
`;

export const getUsersQuery = () => `
query {
  users {
    id
    name
  }
}`;

export const getGroupsByBoardIdQuery = (boardId: number) => `
query {
  boards (${boardId ? `ids:[${boardId}]` : ""}) {
    groups {
      id
      title
    }
  }
}
`;

export const getItemsByIdQuery = (ids: string[]) => `
query {
    items (ids:[${ids}]) {
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
}`;

export const getItemsByPromptBoardIdQuery = (
  board_id: number | string,
  prompt: string
) => `
query {
  items_page_by_column_values  (board_id: ${board_id}, columns: [{column_id: "text", column_values: ["${prompt}"]}]) {
    cursor items {
      id name
    }
  }
}
`;

export const getBoardColumnsQuery = (board_id: number | string) => `
query {
  boards (ids: ${board_id}) {
    columns {
      id
      title
      settings_str
      description
      type
    }
  }
}`;

export const createItemQuery = (data: {
  board_id: string;
  group_id?: string;
  name: string;
  column_values: Record<string, string>;
}) => `
mutation {
  create_item (board_id:${data.board_id}, ${
  data.group_id ? `group_id:"${data.group_id}",` : ""
} item_name:"${data.name}", column_values: "${JSON.stringify(
  data.column_values
).replaceAll(`"`, `\\"`)}") {
  id
}
}
`;

export const getUsersByIdQuery = (ids: string[]) => `
query {
  users (ids:[${ids}]) {
    id
    name
  }
}`;

export const getBoardsQuery = (selectedWorkspace?: string | number | null) => `
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

export const getWorkspacesQuery = () => `
query {
  workspaces {
    id
    name
  }
}`;

export const editItemQuery = (data: {
  board_id: string;
  id: string;
  name: string;
  column_values: Record<string, string>;
}) => `
mutation {
  change_multiple_column_values(
    board_id: ${data.board_id},
    item_id: ${data.id},
    column_values: "${JSON.stringify({
      ...data.column_values,
      name: data.name,
    }).replaceAll(`"`, `\\"`)}"
  ) {
    id
  }
}`;

export const moveItemToGroupQuery = (item_id: string, group_id: string) => `
mutation {
  move_item_to_group (item_id:${item_id}, group_id:${group_id}) {
    id
  }
}`;

export const moveItemToBoardQuery = (item_id: string, board_id: string) => `
mutation {
  move_item_to_board (item_id:${item_id}, board_id:${board_id}) {
    id
  }
}`;

export const createNoteQuery = (item_id: string, body: string) => `
mutation {
  create_update (item_id:${item_id}, body:"${body}") {
    id
  }
}`;

export const getWorkspaceNamesByIdsQuery = (ids: number[]) => `
query {
  workspaces (ids:[${ids}]) {
    name
    id
  }
}
`;
