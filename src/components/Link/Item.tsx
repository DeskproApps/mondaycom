import { useInitialisedDeskproAppClient, useQueryWithClient } from "@deskpro/app-sdk";
import { Button, Checkbox, Stack } from "@deskpro/deskpro-ui";
import { DropdownSelect } from "../DropdownSelect/DropdownSelect";
import { FieldMapping } from "../FieldMapping/FieldMapping";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { IItem } from "../../api/types";
import { LoadingSpinnerCenter } from "../LoadingSpinnerCenter/LoadingSpinnerCenter";
import { Title } from "../../styles";
import { useLinkItems, useTicketCount } from "../../hooks/hooks";
import { useState } from "react";
import getBoardsByWorkspaceId from "@/api/monday/getBoardsByWorkspaceId";
import getBoardsItems from "@/api/monday/getBoardsItems";
import ItemJson from "../../mapping/item.json";

export const LinkItem = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [linkedItems, setLinkedItems] = useState<string[]>([]);
  const [itemLinketCount, setItemLinkedCount] = useState<Record<string, number>>({});
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<Record<string, IItem[]>>({});
  const { getLinkedItems, linkItems } = useLinkItems();
  const { getMultipleItemsTicketCount } = useTicketCount();
  const itemsFromBoard = items[selectedBoard as string];

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Link Item");
  }, []);


  const boardsQuery = useQueryWithClient(
    ["getBoards"],
    (client) => getBoardsByWorkspaceId(client),
    {
      onSuccess: (data) => {
        setItems(
          data.data.boards.reduce(
            (a, c) => ({
              ...a,
              [c.id]: null,
            }),
            {}
          )
        );
      },
    }
  );

  const itemsQuery = useQueryWithClient(
    ["getItems", page.toString(), selectedBoard as string],
    (client) => getBoardsItems({ client, page, boardId: selectedBoard as string }),
    {
      enabled: !!selectedBoard,
      onSuccess: async (data) => {
        const linkedItemsFunc = await getLinkedItems();

        if (!linkedItemsFunc) return;

        const linkedItemsIds = data
          .filter((item) => linkedItemsFunc.includes(item.id))
          .map((e) => e.id);

        const linkedItemTickets = await getMultipleItemsTicketCount(
          linkedItemsIds
        );

        setLinkedItems([...linkedItems, ...linkedItemsIds]);

        setItemLinkedCount({
          ...itemLinketCount,
          ...linkedItemTickets,
        });

        setItems({
          ...items,
          [selectedBoard as string]: [
            ...(itemsFromBoard ?? []),
            ...data.filter(
              (e) =>
                !(itemsFromBoard ?? [])
                  .map((itemFromBoard) => itemFromBoard.id)
                  .includes(e.id)
            ),
          ],
        });
      },
    }
  );

  const boards = boardsQuery.data?.data.boards;

  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      {boardsQuery.isFetching ? (
        <LoadingSpinnerCenter />
      ) : (
        <Stack vertical gap={6} style={{ width: "100%" }} padding={12}>
          <DropdownSelect
            title="Board"
            data={boards?.map((board) => ({
              key: board.name,
              value: board.id,
            }))}
            onChange={(e) => {
              setSelectedBoard(e);
              setLinkedItems([]);
              setPage(1);
            }}
            error={false}
            value={selectedBoard}
          />
          <Stack vertical style={{ width: "100%" }} gap={5}>
            <Stack
              style={{ width: "100%", justifyContent: "space-between" }}
              gap={5}
            >
              <Button
                onClick={() => linkItems(selectedItems)}
                disabled={selectedItems.length === 0}
                text="Link Issue"
              ></Button>
              <Button
                disabled={selectedItems.length === 0}
                text="Cancel"
                intent="secondary"
                onClick={() => setSelectedItems([])}
              ></Button>
            </Stack>
            <HorizontalDivider full />
          </Stack>
          {itemsQuery.isFetching ? (
            <LoadingSpinnerCenter />
          ) : itemsQuery.isSuccess &&
            Array.isArray(itemsFromBoard) &&
            itemsFromBoard?.length !== 0 ? (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              {itemsFromBoard?.map((item, i) => {
                return (
                  <Stack key={i} gap={6} style={{ width: "100%" }}>
                    <Stack style={{ marginTop: "2px" }}>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => {
                          if (selectedItems.includes(item.id)) {
                            setSelectedItems(
                              selectedItems.filter((e) => e !== item.id)
                            );
                          } else {
                            setSelectedItems([...selectedItems, item.id]);
                          }
                        }}
                      ></Checkbox>
                    </Stack>
                    <Stack style={{ width: "92%" }}>
                      <FieldMapping
                        fields={[
                          {
                            ...item,
                            board: item.board.name,
                            linked_tickets: itemLinketCount[item.id] || 0,
                          },
                        ]}
                        hasCheckbox={true}
                        metadata={ItemJson.link}
                        idKey={ItemJson.idKey}
                        internalChildUrl={`/view/item/`}
                        externalChildUrl={ItemJson.externalUrl}
                        childTitleAccessor={(e) => e.name}
                      />
                    </Stack>
                  </Stack>
                );
              })}
              {(itemsFromBoard as []).length >= 10 * page && (
                <Button
                  style={{
                    width: "97%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  text="Load more"
                  intent="secondary"
                  onClick={() => setPage(page + 1)}
                ></Button>
              )}
            </Stack>
          ) : (
            itemsQuery.isSuccess &&
            itemsFromBoard != null && <Title>No Items Found.</Title>
          )}
        </Stack>
      )}
    </Stack>
  );
};
