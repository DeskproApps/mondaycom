import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

interface InstalledRequestParams {
    client: IDeskproClient,
    query: string,
    headers?: Record<string, string>,
}

export default async function installedRequest(params: InstalledRequestParams){
    const { client, query, headers } = params

    const isUsingOAuth2 = (await client.getUserState<boolean>("isUsingOAuth"))[0].data

    const fetch = await proxyFetch(client)

    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: isUsingOAuth2 ? `Bearer [user[oauth2/access_token]]` : "__access_token__",
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


function isResponseError(response: Response){
    return response.status < 200 || response.status >= 400;
}