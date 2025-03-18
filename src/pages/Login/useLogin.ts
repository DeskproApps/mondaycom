import { createSearchParams, useNavigate } from "react-router-dom";
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { OAuth2AccessTokenPath, OAuth2RefreshTokenPath } from "@/constants/deskpro";
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
    const [isPolling, setIsPolling] = useState(false)
    const [oauth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)

    const navigate = useNavigate()

    const { context } = useDeskproLatestAppContext<TicketData, Settings>()

    const ticketId = context?.data?.ticket.id
    const isUsingOAuth = context?.settings.use_access_token !== true || context.settings.use_advanced_connect === false

    useInitialisedDeskproAppClient(async (client) => {
        if (context?.settings.use_advanced_connect === undefined || !ticketId) {
            // Make sure settings have loaded.
            return
        }

        // Ensure they aren't using access tokens
        if (!isUsingOAuth) {
            setError("Enable OAuth to access this page");
            return

        }
        const mode = context?.settings.use_advanced_connect ? 'local' : 'global';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && typeof clientId !== 'string') {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }
        const oauth2Response = mode === "local" ?
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
                    const url = new URL(oauth2Response.authorizationUrl);
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

        setAuthUrl(oauth2Response.authorizationUrl)
        setOAuth2Context(oauth2Response)


    }, [setAuthUrl, context?.settings.use_advanced_connect])


    useInitialisedDeskproAppClient((client) => {
        if (!ticketId || !oauth2Context) {
            return
        }

        const startPolling = async () => {
            try {
                const result = await oauth2Context.poll()

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
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            startPolling()
        }
    }, [isPolling, ticketId, oauth2Context, navigate])

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        setIsPolling(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);


    return { authUrl, onSignIn, error, isLoading }

}