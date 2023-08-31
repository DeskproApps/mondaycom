import { useDeskproAppTheme } from "@deskpro/app-sdk";
import {
  AnyIcon,
  DivAsInput,
  Dropdown as DropdownComponent,
  DropdownTargetProps,
  H1,
  Label,
  Stack,
} from "@deskpro/deskpro-ui";
import {
  faCaretDown,
  faCheck,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useMemo } from "react";
type Props = {
  data?: {
    key: string;
    value: string | null | number;
  }[];
  onChange: (key: string) => void;
  title: string;
  value: string | string[] | null;
  error: boolean;
  required?: boolean;
  multiple?: boolean;
};
export const DropdownSelect = ({
  data,
  onChange,
  title,
  value,
  error,
  required,
  multiple,
}: Props) => {
  const { theme } = useDeskproAppTheme();

  const dataOptions = useMemo(() => {
    return data?.map((dataInList) => ({
      key: dataInList.key,
      label: <Label label={dataInList.key}></Label>,
      value: dataInList.value,
      type: "value" as const,
    }));
  }, [data]) as {
    value: string;
    key: string;
    label: ReactNode;
    type: "value";
  }[];

  return (
    <Stack
      vertical
      style={{ marginTop: "5px", color: theme.colors.grey80, width: "100%" }}
    >
      <Stack>
        <H1>{title}</H1>
        {required && (
          <Stack style={{ color: "red" }}>
            <H1>⠀*</H1>
          </Stack>
        )}
      </Stack>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
      <DropdownComponent<any, HTMLDivElement>
        placement="bottom-start"
        options={dataOptions.map((e) => ({
          ...e,
          selected: ["number", "string"].includes(typeof value)
            ? e.value === value
            : value?.includes(e.value),
        }))}
        fetchMoreText={"Fetch more"}
        autoscrollText={"Autoscroll"}
        selectedIcon={faCheck as AnyIcon}
        externalLinkIcon={faExternalLinkAlt as AnyIcon}
        onSelectOption={(option) => {
          onChange(
            multiple
              ? value?.includes(option.value)
                ? ((value as string[]) || []).filter((e) => option.value !== e)
                : [...(value || []), option.value]
              : option.value
          );
        }}
      >
        {({ targetProps, targetRef }: DropdownTargetProps<HTMLDivElement>) => (
          <DivAsInput
            error={error}
            ref={targetRef}
            {...targetProps}
            variant="inline"
            rightIcon={faCaretDown as AnyIcon}
            placeholder="Enter value"
            style={{ fontWeight: "400 !important" }}
            value={
              multiple
                ? dataOptions
                    .filter((e) => value?.includes(e.value))
                    .reduce(
                      (a, c, i, arr) =>
                        a + `${c.key}${i === arr.length - 1 ? "" : ", "} `,
                      ""
                    )
                : dataOptions.find((e) => e.value == value)?.key
            }
          />
        )}
      </DropdownComponent>
    </Stack>
  );
};
