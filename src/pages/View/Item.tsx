import {
  LoadingSpinner,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import ItemJson from "../../mapping/item.json";
import { useNavigate, useParams } from "react-router-dom";
import { useLinkItems, useTicketCount } from "../../hooks/hooks";
import { Notes } from "../../components/Notes/Notes";
import { Stack } from "@deskpro/deskpro-ui";
import { getItemsById } from "../../api/api";
import { useEffect, useState } from "react";
import { IItem } from "../../api/types";

export const ViewItem = () => {
  const { itemId } = useParams();
  const { unlinkItem } = useLinkItems();
  const navigate = useNavigate();
  const [itemLinketCount, setItemLinkedCount] = useState<number>(0);

  const { getItemTicketCount } = useTicketCount();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("monday.com");

    client.registerElement("editButton", {
      type: "edit_button",
    });

    client.registerElement("homeButton", {
      type: "home_button",
    });

    client.deregisterElement("plusButton");
  }, []);

  useEffect(() => {
    (async () => {
      const itemLinkedCount = await getItemTicketCount(itemId as string);

      setItemLinkedCount(itemLinkedCount as number);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getItemTicketCount, itemId]);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "menuButton":
          await unlinkItem(itemId as string);

          navigate("/redirect");

          break;

        case "editButton":
          navigate("/edit/item/" + itemId);

          break;

        case "homeButton":
          navigate("/redirect");
      }
    },
  });

  const itemsByIdQuery = useQueryWithClient(
    ["getItemById", itemId as string],
    (client) => getItemsById(client, [itemId as string]),
    {
      enabled: !!itemId,
    }
  );

  const item = itemsByIdQuery?.data?.[0];

  const notes = item?.updates;

  if (itemsByIdQuery.isFetching) return <LoadingSpinner />;

  return (
    <Stack vertical gap={10}>
      <FieldMapping
        fields={[
          {
            ...item,
            linked_tickets: itemLinketCount || 0,
          },
        ]}
        metadata={ItemJson.view}
        childTitleAccessor={(e) => e.name}
        idKey={ItemJson.idKey}
        externalChildUrl={ItemJson.externalUrl}
      />
      <Notes id={itemId as string} notes={notes as IItem["updates"]}></Notes>
    </Stack>
  );
};
