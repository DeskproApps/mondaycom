import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useTicketCount = () => {
  const { client } = useDeskproAppClient();

  const getItemTicketCount = useCallback(
    async (itemId: string) => {
      if (!client) return;

      return (await client.getState(`item/${itemId}`))?.[0]?.data as
        | number
        | undefined;
    },
    [client]
  );

  const getMultipleItemsTicketCount = useCallback(
    async (itemIds: string[] = []) => {
      if (!client) return {};

      const itemObjArr = await Promise.all(
        itemIds.map(async (id) => ({
          [id]: (await getItemTicketCount(id)) || 0,
        }))
      );

      return itemObjArr.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    },
    [client, getItemTicketCount]
  );

  const incrementItemTicketCount = useCallback(
    async (itemId: string) => {
      if (!client) return;

      return await client.setState(
        `item/${itemId}`,
        ((await getItemTicketCount(itemId)) || 0) + 1
      );
    },
    [client, getItemTicketCount]
  );

  const decrementItemTicketCount = useCallback(
    async (itemId: string) => {
      if (!client) return;

      return await client.setState(
        `item/${itemId}`,
        ((await getItemTicketCount(itemId)) || 1) - 1
      );
    },
    [client, getItemTicketCount]
  );

  return {
    getItemTicketCount,
    incrementItemTicketCount,
    decrementItemTicketCount,
    getMultipleItemsTicketCount,
  };
};

type ContextData ={
  ticket?: {
    id: string,
    subject: string
  }
}

export const useLinkItems = () => {
  const { context } = useDeskproLatestAppContext<ContextData, unknown>();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const { incrementItemTicketCount, decrementItemTicketCount } =
    useTicketCount();

  const ticket = context?.data?.ticket;

  const linkItems = useCallback(
    async (itemsIds: string[]) => {
      if (!context || !itemsIds.length || !client || !ticket) return;

      setIsLinking(true);

      await Promise.all(
        (itemsIds || []).map((id) =>
          client.getEntityAssociation("linkedItems", ticket.id).set(id)
        )
      );

      await Promise.all(itemsIds.map((id) => incrementItemTicketCount(id)));

      navigate("/");

      setIsLinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, client, ticket, incrementItemTicketCount]
  );

  const getLinkedItems = useCallback(async () => {
    if (!client || !ticket) return;

    return await client.getEntityAssociation("linkedItems", ticket.id).list();
  }, [client, ticket]);

  const unlinkItem = useCallback(
    async (itemId: string) => {
      if (!client || !ticket) return;

      await client
        .getEntityAssociation("linkedItems", ticket.id)
        .delete(itemId);

      await decrementItemTicketCount(itemId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [client, decrementItemTicketCount, ticket]
  );
  return {
    linkItems,
    isLinking,
    getLinkedItems,
    unlinkItem,
  };
};
