import { Button, P8, Stack } from "@deskpro/deskpro-ui";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { useDeskproAppClient, useDeskproAppEvents, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import createNote from "@/api/monday/createNote";

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
          navigate("/home");
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
            if (!client || !itemId) return;

            setSubmitting(true);

            if (note.length === 0) {
              setError("Note cannot be empty");

              return;
            }

            await createNote({ client, item_id: itemId, body: note });

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
