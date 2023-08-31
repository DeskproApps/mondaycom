import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { Button, P8, Stack } from "@deskpro/deskpro-ui";
import { createNote } from "../../api/api";

export const CreateNote = () => {
  const { client } = useDeskproAppClient();
  const navigate = useNavigate();
  const { itemId } = useParams();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Update");

    client.deregisterElement("editButton");
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");
      }
    },
  });

  return (
    <Stack style={{ width: "100%" }} vertical gap={8}>
      <InputWithTitle
        title="New update"
        setValue={(e) => setNote(e.target.value)}
        data-testid="note-input"
        value={note}
        required={true}
      />
      <Stack justify="space-between" style={{ width: "100%" }}>
        <Button
          data-testid="button-submit"
          onClick={async () => {
            if (!client) return;

            setSubmitting(true);

            if (note.length === 0) {
              setError("Note cannot be empty");

              return;
            }

            await createNote(client, itemId as string, note);

            navigate(-1);
          }}
          text={submitting ? "Creating..." : "Create"}
          disabled={submitting}
        />
        <Button onClick={() => navigate(-1)} text="Cancel" intent="secondary" />
      </Stack>
      {error && <P8 color="red">{error}</P8>}
    </Stack>
  );
};
