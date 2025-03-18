import { IDeskproClient } from "@deskpro/app-sdk";
import installedRequest from "../installedRequest";

export default async function getUsers(
  client: IDeskproClient): Promise<{
    data: {
      users: {
        id: string;
        name: string;
      }[];
    };
  }> {
  return await installedRequest({ client, query: getUsersQuery() });
};

function getUsersQuery() {
  return `
  query {
    users {
      id
      name
    }
  }`;
}
