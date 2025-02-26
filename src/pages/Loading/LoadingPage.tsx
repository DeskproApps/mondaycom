import { FC, useState } from "react"
import { LoadingSpinner, useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Settings, TicketData } from "@/types/deskpro";
import { Stack } from "@deskpro/deskpro-ui";
import { useNavigate } from "react-router-dom";
import getActiveMondayUser from "@/api/monday/getActiveMondayUser";
import StyledErrorBlock from "@/components/StyledErrorBlock";

const LoadingPage: FC = () => {
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<TicketData, Settings>()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isFetchingAuth, setIsFetchingAuth] = useState<boolean>(true)

  const navigate = useNavigate()

  // Determine authentication method from settings
  const isUsingOAuth = context?.settings.use_access_token !== true
  const ticketId = context?.data?.ticket.id

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements()
    registerElement("refresh", { type: "refresh_button" })
  });

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Monday.com")

    if (!context?.settings || !ticketId) {
      return
    }

    // Store the authentication method in the user state
    client.setUserState("isUsingOAuth", isUsingOAuth)

    // Verify Monday.com authentication status
    // If OAuth2 mode and the user is logged in the request would be make with their stored access token
    // If access token mode the request would be made with the access token provided in the app setup
    getActiveMondayUser(client)
      .then((activeUser) => {
        if (activeUser) {
          setIsAuthenticated(true)
        }
      })
      .catch(() => { })
      .finally(() => {
        setIsFetchingAuth(false)
      })
  }, [context, context?.settings])



  if (!client || !ticketId || isFetchingAuth) {
    return (<LoadingSpinner />)
  }

  if (isAuthenticated) {
    // Check for linked Monday.com items for this ticket
    // and navigate based on the number of linked items
    client.getEntityAssociation("linkedItems", ticketId).list()
      .then((linkedItemIds) => {
        linkedItemIds.length < 1 ? navigate("/findOrCreate") :
          navigate("/home")
      })
      .catch(() => { navigate("/findOrCreate") })
  } else {

    if (isUsingOAuth) {
      navigate("/login")
    } else {
      // Show error for invalid access tokens (expired or not present)
      return (
        <Stack padding={12}>
          <StyledErrorBlock>Invalid Access Token</StyledErrorBlock>
        </Stack>
      )
    }
  }

  return (<LoadingSpinner />);
}

export default LoadingPage