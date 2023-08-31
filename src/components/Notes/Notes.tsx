import { formatDateSince } from "../../utils/dateUtils";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Avatar, H1, H2, Stack } from "@deskpro/deskpro-ui";
import styled from "styled-components";
import { IItem } from "../../api/types";

type Props = {
  notes: IItem["updates"];
  id: string;
};

const HTMLDiv = styled.div`
  & > p {
    margin: 0;
  }
`;

export const Notes = ({ notes, id }: Props) => {
  const navigate = useNavigate();
  return (
    <Stack vertical gap={10} style={{ width: "100%" }}>
      <HorizontalDivider full />
      <Stack gap={5}>
        <H1>Updates ({notes.length})</H1>
        <FontAwesomeIcon
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          icon={faPlus as any}
          size="sm"
          style={{
            alignSelf: "center",
            cursor: "pointer",
            marginBottom: "2px",
          }}
          onClick={() => navigate(`/create/note/${id}`)}
        ></FontAwesomeIcon>
      </Stack>
      {notes.map((note, i) => (
        <Stack key={i} vertical gap={5} style={{ width: "100%" }}>
          <Stack style={{ alignItems: "flex-start", marginTop: "5px" }} gap={5}>
            <Stack
              vertical
              gap={3}
              style={{
                marginLeft: "5px",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar size={22} name={note.creator.name}></Avatar>
              <H2 style={{ width: "5ch" }}>
                {formatDateSince(new Date(note.created_at)).slice(0, 5)}
              </H2>
            </Stack>
            <HTMLDiv dangerouslySetInnerHTML={{ __html: note.body }} />
          </Stack>
          <HorizontalDivider full={i === notes.length - 1} />
        </Stack>
      ))}
    </Stack>
  );
};
