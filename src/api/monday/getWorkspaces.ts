import { IDeskproClient } from "@deskpro/app-sdk";
import { IWorkspaces } from "../types";
import installedRequest from "../installedRequest";

export default async function getWorkspaces(client: IDeskproClient): Promise<{
  data: {
    workspaces: IWorkspaces[];
  };
}> {
  return await installedRequest({ client, query: getWorkspacesQuery() });

}

function getWorkspacesQuery() {
  return `
  query {
    workspaces {
      id
      name
    }
  }`;
}
