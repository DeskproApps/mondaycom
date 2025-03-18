import { AnchorButton, H3, Stack } from "@deskpro/deskpro-ui"
import { FC } from "react"
import { Settings } from "@/types/deskpro"
import { useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk"
import StyledErrorBlock from "@/components/StyledErrorBlock"
import useLogin from "./useLogin"

const LoginPage: FC = () => {
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" })
    })

    const { onSignIn, authUrl, isLoading, error } = useLogin();
    const { context } = useDeskproLatestAppContext<unknown, Settings>()

    const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';
    const installURL = `https://auth.monday.com/oauth2/authorize?client_id=${mode === "global" ? "91871bc3c3f1f987f513063f6780c348" : context?.settings.client_id}&response_type=install`

    return (
        <Stack padding={12} vertical gap={12} role="alert">
            <H3>Log into your Monday.com account.</H3>
            <Stack gap={10}>
                <AnchorButton
                    disabled={!authUrl || isLoading}
                    href={authUrl || "#"}
                    loading={isLoading}
                    onClick={onSignIn}
                    target={"_blank"}
                    text={"Log In"}
                />

                <AnchorButton
                    disabled={!authUrl}
                    href={installURL}
                    intent={"secondary"}
                    target={"_blank"}
                    text={"Install App"}
                />
            </Stack>

            {error && <StyledErrorBlock>{error}</StyledErrorBlock>}
        </Stack>
    )
}

export default LoginPage