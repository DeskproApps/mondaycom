import {
  LoadingSpinner,
  Title,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLinkItems, useTicketCount } from "../hooks/hooks";
import { getItemsById } from "../api/api";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import ItemJson from "../mapping/item.json";
import { Stack } from "@deskpro/deskpro-ui";

export const Main = () => {
  const { context } = useDeskproLatestAppContext();
  const navigate = useNavigate();
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [itemLinketCount, setItemLinkedCount] = useState<
    Record<string, number>
  >({});
  const { getLinkedItems } = useLinkItems();
  const { getMultipleItemsTicketCount } = useTicketCount();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("monday.com");

    client.deregisterElement("homeButton");

    client.deregisterElement("menuButton");

    client.registerElement("plusButton", {
      type: "plus_button",
    });

    client.deregisterElement("editButton");

    client.registerElement("refreshButton", {
      type: "refresh_button",
    });
  }, []);

  useInitialisedDeskproAppClient(
    (client) => {
      client.setBadgeCount(itemIds.length);
    },
    [itemIds]
  );

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "plusButton":
          navigate("/findOrCreate");
          break;
      }
    },
  });
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
    <Stack vertical style={{ width: "100%"}}>
      <FieldMapping
        fields={items.map((e) => ({
          ...e,
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
