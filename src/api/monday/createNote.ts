import { IDeskproClient } from "@deskpro/app-sdk"
import installedRequest from "../installedRequest";

interface CreateNoteParams {
    client: IDeskproClient,
    item_id: string,
    body: string
}

export default async function createNote(params: CreateNoteParams) {

    const { client, item_id, body } = params
    return await installedRequest({ client, query: createNoteQuery(item_id, body) });

}

function createNoteQuery(item_id: string, body: string) {
    return `
    mutation {
      create_update (item_id:${item_id}, body:"${body}") {
        id
      }
    }`;
}