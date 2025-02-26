import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";

export default async function createItem(
    client: IDeskproClient,
    data: {
        board: string;
        id: string;
        name: string;
        column_values: Record<string, string>;
    }) {
    return await installedRequest({ client, query: createItemQuery(data) })
}

function createItemQuery(data: {
    board: string;
    group_id?: string;
    name: string;
    column_values: Record<string, string>;
}) {
    return `
  mutation {
    create_item (board_id:${data.board}, ${data.group_id ? `group_id:"${data.group_id}",` : ""
        } item_name:"${data.name}", column_values: "${JSON.stringify(
            data.column_values ?? []
        ).replaceAll(`"`, `\\"`)}") {
    id
  }
  }
  `
}