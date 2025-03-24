import { AppElementPayload, LoadingSpinner, Title, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient, useQueryWithClient } from "@deskpro/app-sdk";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import { Settings } from "@/types/deskpro";
import { Stack } from "@deskpro/deskpro-ui";
import { useEffect, useState } from "react";
import { useLinkItems, useTicketCount } from "../hooks/hooks";
import { useLogout } from "@/api/deskpro";
import { useNavigate } from "react-router-dom";
import getItemsById from "@/api/monday/getItemsById";
import ItemJson from "../mapping/item.json";

export const Main = () => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const navigate = useNavigate();
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [itemLinketCount, setItemLinkedCount] = useState<
    Record<string, number>
  >({});
  const { getLinkedItems } = useLinkItems();
  const { getMultipleItemsTicketCount } = useTicketCount();
  const { logoutActiveUser } = useLogout()

  const isUsingOAuth = context?.settings.use_access_token !== true || context.settings.use_advanced_connect === false


  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("plusButton", { type: "plus_button" })
    registerElement("refresh", { type: "refresh_button" })
    if (isUsingOAuth) {
      registerElement("menuButton", { type: "menu", items: [{ title: "Logout" }] })
    }
  }, [])

  useDeskproAppEvents({
    onElementEvent(id: string, _type: string, _payload?: AppElementPayload) {
      switch (id) {
        case "plusButton":
          navigate("/findOrCreate");
          break;
        case "menuButton":
          if (isUsingOAuth) {
            logoutActiveUser()
          }
          break;
      }
    },
  })

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("monday.com");
  }, []);

  useInitialisedDeskproAppClient(
    (client) => {
      client.setBadgeCount(itemIds.length);
    },
    [itemIds]
  );

  const itemsByIdQuery = useQueryWithClient(
    ["getItemsById"],
    (client) => getItemsById(client, itemIds),
    {
      enabled: !!itemIds.length,
    }
  );

  useEffect(() => {
    if (!itemsByIdQuery.error) return;
  }, [itemsByIdQuery.error]);

  useInitialisedDeskproAppClient(() => {
    (async () => {
      if (!context) return;

      const linkedItems = await getLinkedItems();

      if (!linkedItems || linkedItems.length === 0) {
        navigate("/findOrCreate");

        return;
      }

      setItemIds(linkedItems as string[]);

      const itemLinkedCount = await getMultipleItemsTicketCount(linkedItems);

      setItemLinkedCount(itemLinkedCount);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  if (!itemsByIdQuery.isSuccess || !itemLinketCount || !itemsByIdQuery.data) return <LoadingSpinner />;

  const items = itemsByIdQuery.data;

  if (items.length === 0) return <Title title="No found" />;
  return (
    <Stack vertical style={{ width: "100%" }} padding={12}>
      <FieldMapping
        fields={items.map((e) => ({
          ...e,
          board_id: e.board.id,
          board: e.board.name,
          linked_tickets: itemLinketCount[e.id],
        }))}
        metadata={ItemJson.link}
        idKey={ItemJson.idKey}
        internalChildUrl={`/view/item/`}
        externalChildUrl={ItemJson.externalUrl}
        childTitleAccessor={(e) => e.name}
      />
    </Stack>
  );
};
