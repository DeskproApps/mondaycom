import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { H1, Input, P8, Stack } from "@deskpro/deskpro-ui";

interface Props {
  title: string;
  error?: boolean;
  required?: boolean;
  value?: string;
  setValue: (item: { target: { value: string } }) => void;
}

export const InputWithTitle = ({
  title,
  error,
  required,
  value,
  setValue,
  ...attributes
}: Props) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Stack vertical style={{ width: "100%", marginTop: "5px" }}>
      <Stack>
        <div style={{ color: theme?.colors?.grey80 }}>
          <P8>{title}</P8>
        </div>
        {required && (
          <Stack style={{ color: theme?.colors?.red100 }}>
            <H1>⠀*</H1>
          </Stack>
        )}
      </Stack>
      <Input
        error={error}
        variant="inline"
        placeholder={`Enter value`}
        style={{ fontWeight: "normal" }}
        type={"title"}
        onChange={setValue as () => void}
        value={value}
        {...attributes}
      />
    </Stack>
  );
};
