import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";

export default async function getUsersById(
  client: IDeskproClient,
  ids: string[]
): Promise<{
  data: {
    users: {
      id: string;
      name: string;
    }[];
  };
}> {
  return await installedRequest({ client, query: getUsersByIdQuery(ids) });
};

function getUsersByIdQuery(ids: string[]) {
  return `
  query {
    users (ids:[${ids}]) {
      id
      name
    }
  }`;
}
