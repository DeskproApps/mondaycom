import { TwoButtonGroup } from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { LinkItem } from "../../components/Link/Item";
import { MutateItem } from "../../components/Mutate/Item";
import { Stack } from "@deskpro/deskpro-ui";

export const FindOrCreate = ({ pageParam }: { pageParam?: 0 | 1 }) => {
  const [page, setPage] = useState<0 | 1>(pageParam || 0);

  return (
    <Stack vertical>
      <Stack style={{ alignSelf: "center" }}>
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
