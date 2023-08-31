import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { H1, Input, Stack } from "@deskpro/deskpro-ui";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  title: string;
  error: boolean;
  required?: boolean;
  register: UseFormRegisterReturn;
  type?: string;
}

export const InputWithTitleRegister = ({
  title,
  error,
  required,
  register,
  type,
  ...attributes
}: Props) => {
  const { theme } = useDeskproAppTheme();
  return (
    <Stack vertical style={{ width: "100%", marginTop: "5px" }}>
      <Stack>
        <div style={{ color: theme?.colors?.grey80 }}>
          <H1>{title}</H1>
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
        placeholder={`Enter ${type === "number" ? "number" : "value"}`}
        type={type ?? "title"}
        {...register}
        {...attributes}
      />
    </Stack>
  );
};
