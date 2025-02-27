import { createSearchParams, useNavigate } from "react-router-dom";
import { OAuth2AccessTokenPath, OAuth2RefreshTokenPath } from "@/constants/deskpro";
import { OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Settings, TicketData } from "@/types/deskpro";
import { useCallback, useState } from "react";
import getAccessToken from "@/api/monday/getAccessToken";
import getActiveMondayUser from "@/api/monday/getActiveMondayUser";

interface UseLogin {
    onSignIn: () => void,
    authUrl: string | null,
    error: null | string,
    isLoading: boolean,
};

export default function useLogin(): UseLogin {
    const [authUrl, setAuthUrl] = useState<string | null>(null)
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { context } = useDeskproLatestAppContext<TicketData, Settings>()

    const ticketId = context?.data?.ticket.id

    useInitialisedDeskproAppClient(async (client) => {
        if (context?.settings.use_deskpro_saas === undefined || !ticketId) {
            // Make sure settings have loaded.
            return
        }

        // Ensure they aren't using access tokens
        if (context.settings.use_access_token === true) {
            setError("Enable OAuth to access this page");
            return

        }
        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && typeof clientId !== 'string') {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }
        const oauth2 = mode === "local" ?
            await client.startOauth2Local(
                ({ state, callbackUrl }) => {
                    return `https://auth.monday.com/oauth2/authorize?${createSearchParams([
                        ["response_type", "code"],
                        ["client_id", clientId ?? ""],
                        ["state", state],
                        ["redirect_uri", callbackUrl]
                    ])}`
                },
                /\bcode=(?<code>[^&#]+)/,
                async (code: string): Promise<OAuth2Result> => {
                    // Extract the callback URL from the authorization URL
                    const url = new URL(oauth2.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data = await getAccessToken(client, code, redirectUri);

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("91871bc3c3f1f987f513063f6780c348");

        setAuthUrl(oauth2.authorizationUrl)
        setIsLoading(false)

        try {
            const result = await oauth2.poll()

            await client.setUserState(OAuth2AccessTokenPath, result.data.access_token, { backend: true })

            if (result.data.refresh_token) {
                await client.setUserState(OAuth2RefreshTokenPath, result.data.refresh_token, { backend: true })
            }

            const activeUser = await getActiveMondayUser(client)

            if (!activeUser) {
                throw new Error("Error authenticating user")
            }

            const linkedItemIds = await client.getEntityAssociation("linkedItems", ticketId).list()

            if (linkedItemIds.length < 1) {
                navigate("/findOrCreate")
            } else {
                navigate("/home")
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            setIsLoading(false);
        }
    }, [setAuthUrl, context?.settings.use_deskpro_saas])

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);


    return { authUrl, onSignIn, error, isLoading }

}