import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

export default async function getAccessToken(
    client: IDeskproClient,
    code: string,
    callbackUrl: string
) {

    try {
        const fetch = await proxyFetch(client);

        const response = await fetch("https://auth.monday.com/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: "__client_id__",
                client_secret: "__client_secret__",
                grant_type: "authorization_code",
                code: code,
                redirect_uri: callbackUrl,
            })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch access token")
        }

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error("Error fetching access token")
    }
}
