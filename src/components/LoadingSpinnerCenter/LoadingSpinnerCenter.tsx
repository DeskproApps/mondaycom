import { LoadingSpinner } from "@deskpro/app-sdk";
import { Stack } from "@deskpro/deskpro-ui";

export const LoadingSpinnerCenter = () => {
  return (
    <Stack style={{ width: "100%" }} justify="center">
      <LoadingSpinner />
    </Stack>
  );
};
