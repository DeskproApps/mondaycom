import { AnchorButton, H3, Stack } from "@deskpro/deskpro-ui"
import { FC } from "react"
import { useDeskproElements } from "@deskpro/app-sdk"
import StyledErrorBlock from "@/components/StyledErrorBlock"
import useLogin from "./useLogin"

const LoginPage: FC = () => {
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" })
    })

    const { onSignIn, authUrl, isLoading, error } = useLogin();

    return (
        <Stack padding={12} vertical gap={12} role="alert">
            <H3>Log into your Monday.com account.</H3>
            <AnchorButton
                disabled={!authUrl || isLoading}
                href={authUrl || "#"}
                loading={isLoading}
                onClick={onSignIn}
                target={"_blank"}
                text={"Log In"}
            />

            {error && <StyledErrorBlock>{error}</StyledErrorBlock>}
        </Stack>
    )
}

export default LoginPage