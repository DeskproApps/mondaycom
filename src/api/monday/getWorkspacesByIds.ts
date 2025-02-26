import { IDeskproClient } from "@deskpro/app-sdk";
import { IWorkspaces } from "../types";
import installedRequest from "../installedRequest";


export default async function getWorkspacesByIds(client: IDeskproClient, ids: number[]): Promise<{
  data: { workspaces: IWorkspaces[] };
}> {
  return installedRequest({ client, query: getWorkspaceNamesByIdsQuery(ids) });
}

function getWorkspaceNamesByIdsQuery(ids: number[]) {
  return `
  query {
    workspaces (ids:[${ids}]) {
      name
      id
    }
  }`;
}
