import { IBoard } from "../types";
import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";

interface GetItemsByPromptBoardIdParams {
    client: IDeskproClient,
    boardId: string,
    prompt: string
}

export default async function getItemsByPromptBoardId(params: GetItemsByPromptBoardIdParams): Promise<{
    data: { boards: IBoard[] }
}> {

    const { client, boardId, prompt } = params
    return await installedRequest(
        {
            client,
            query: getItemsByPromptBoardIdQuery(boardId, prompt),
            headers: {
                "API-Version": "2023-10",
            }
        }
    );
};

function getItemsByPromptBoardIdQuery(board_id: number | string, prompt: string) {
    return `
    query {
      items_page_by_column_values  (board_id: ${board_id}, columns: [{column_id: "text", column_values: ["${prompt}"]}]) {
        cursor items {
          id
          name
        }
      }
    }`;
}
