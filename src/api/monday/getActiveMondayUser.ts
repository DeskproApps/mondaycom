import { IDeskproClient } from "@deskpro/app-sdk";
import { MondayUser } from "../types";
import installedRequest from "../installedRequest";

export default async function getActiveMondayUser(client: IDeskproClient): Promise<{
  data: {
    me: MondayUser
  };
} | null> {
  try {
    return await installedRequest({ client, query: getActiveMondayUserQuery() });
  } catch (e) {
    return null
  }
}

function getActiveMondayUserQuery() {
  return `
  query {
    me {
      id
      name
      email
      is_guest
      created_at
    }
  }`;
}