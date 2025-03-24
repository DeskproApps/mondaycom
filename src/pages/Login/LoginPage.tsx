import { AnchorButton, H3, P5, Stack } from "@deskpro/deskpro-ui"
import { FC } from "react"
import { Settings } from "@/types/deskpro"
import { useDeskproAppTheme, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk"
import StyledErrorBlock from "@/components/StyledErrorBlock"
import useLogin from "./useLogin"

const LoginPage: FC = () => {
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" })
    })

    const { onSignIn, authUrl, isLoading, error } = useLogin();
    const { context } = useDeskproLatestAppContext<unknown, Settings>()
        const { theme } = useDeskproAppTheme();
    

    const mode = context?.settings.use_advanced_connect === false ? 'global' : 'local';
    
    const installURL = `https://auth.monday.com/oauth2/authorize?client_id=${mode === "global" ? "91871bc3c3f1f987f513063f6780c348" : context?.settings.client_id}&response_type=install`

    return (
        <Stack padding={12} vertical gap={12} role="alert">
            <H3>Log into your monday.com account.</H3>
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
            
            <P5 style={{ color: theme.colors.grey100, width: "100%" }}>
            Please ensure that the app is installed on your account before logging in. If you haven’t installed the app yet, click the 'Install App' button to add it to your account.
            </P5>

            {error && <StyledErrorBlock>{error}</StyledErrorBlock>}
        </Stack>
    )
}

export default LoginPage