import { AppElementPayload, TwoButtonGroup, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { LinkItem } from "../../components/Link/Item";
import { MutateItem } from "../../components/Mutate/Item";
import { Settings } from "@/types/deskpro";
import { Stack } from "@deskpro/deskpro-ui";
import { useLogout } from "@/api/deskpro";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const FindOrCreate = ({ pageParam }: { pageParam?: 0 | 1 }) => {
  const [page, setPage] = useState<0 | 1>(pageParam || 0);
  const { context } = useDeskproLatestAppContext<unknown, Settings>()
  const { logoutActiveUser } = useLogout()
  const navigate = useNavigate();

  const isUsingOAuth = context?.settings.use_access_token !== true || context.settings.use_deskpro_saas === true

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("homeButton", { type: "home_button" })
    registerElement("refresh", { type: "refresh_button" })

    if (isUsingOAuth) {
      registerElement("menuButton", { type: "menu", items: [{ title: "Logout" }] })
    }
  }, [])

  useDeskproAppEvents({
    onElementEvent(id: string, _type: string, _payload?: AppElementPayload) {
      switch (id) {
        case "homeButton":
          navigate("/home");
          break;
        case "menuButton":
          if (isUsingOAuth) {
            logoutActiveUser()
          }
          break;
      }
    },
  })

  return (
    <Stack vertical>
      <Stack style={{ alignSelf: "center" }} padding={12}>
        <TwoButtonGroup
          selected={
            {
              0: "one",
              1: "two",
            }[page] as "one" | "two"
          }
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Find Item⠀⠀"
          twoLabel="Create Item⠀⠀"
          oneOnClick={() => setPage(0)}
          twoOnClick={() => setPage(1)}
        ></TwoButtonGroup>
      </Stack>

      {
        {
          0: <LinkItem />,
          1: <MutateItem />,
        }[page]
      }
    </Stack>
  );
};
