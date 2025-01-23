import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { Button, Stack } from "@deskpro/deskpro-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ZodTypeAny, z } from "zod";
import {
  createItem,
  editItem,
  getBoardColumns,
  getBoardsByWorkspaceId,
  getItemsById,
  getUsers,
  getWorkspaces,
} from "../../api/api";
import { useLinkItems } from "../../hooks/hooks";
import { useQueryMutationWithClient } from "../../hooks/useQueryWithClient";
import itemJson from "../../mapping/item.json";
import { getItemSchema } from "../../schemas";
import { FieldMappingInputs } from "../../types/types";
import { getDropdownDataForObject } from "../../utils/utils";
import { DropdownSelect } from "../DropdownSelect/DropdownSelect";
import { FieldMappingInput } from "../FieldMappingInput/FieldMappingInput";
import { InputWithTitleRegister } from "../InputWithTitle/InputWithTitleRegister";
import { LoadingSpinnerCenter } from "../LoadingSpinnerCenter/LoadingSpinnerCenter";

const inputs = itemJson.create;

export const MutateItem = ({ id }: { id?: string }) => {
  const navigate = useNavigate();
  const [schema, setSchema] = useState<ZodTypeAny | null>(null);
  const { linkItems } = useLinkItems();
  const [columnData, setColumnData] = useState<FieldMappingInputs>([]);
  const [dataInsertedDropdown, setDataInsertedDropdown] = useState<
    Record<string, string[]>
  >({});

  const isEditMode = !!id;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm(
    {
    resolver: zodResolver(schema as ZodTypeAny),
  }
);
 
  useEffect(() => {
    reset({ workspace: null });
  }, [reset]);

  const [selectedWorkspace, selectedBoard] = watch(["workspace", "board"]);

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("plusButton");

    client.deregisterElement("editButton");
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");

          break;
      }
    },
  });

  const submitMutation = useQueryMutationWithClient((client, data) => {
    return isEditMode
      ? editItem(client, data as Awaited<Parameters<typeof editItem>[1]>)
      : createItem(client, data as Awaited<Parameters<typeof createItem>[1]>);
  });

  const itemQuery = useQueryWithClient(
    ["item", id as string],
    (client) => getItemsById(client, [id as string]),
    {
      enabled: !!id,
    }
  );

  const workspacesQuery = useQueryWithClient(
    ["workspaces"],
    (client) => getWorkspaces(client),
    {
      enabled: !isEditMode,
    }
  );

  const usersQuery = useQueryWithClient(["users"], (client) =>
    getUsers(client)
  );

  const boardsQuery = useQueryWithClient(
    ["boards", selectedWorkspace],
    (client) => getBoardsByWorkspaceId(client, selectedWorkspace),
    {
      enabled:
        (!!selectedWorkspace || selectedWorkspace == null) && !isEditMode,
    }
  );

  const columnsQuery = useQueryWithClient(
    ["columns", selectedBoard as string],
    (client) => getBoardColumns(client, selectedBoard.id),
    {
      enabled: !!selectedBoard,
      onSuccess: (data) => {
        setColumnData(
          data.data.boards[0].columns.map((column) => ({
            name: `column_data_${column.id}`,
            label: column.title,
            settings_str: column.settings_str,
            type: ["multiple-person", "person"].includes(column.type)
              ? "users"
              : column.type,
            multiple: ["dropdown", "multiple-person", "person"].includes(
              column.type
            ),
          }))
        );
      },
    }
  );

  useEffect(() => {
    if (!id || !itemQuery.isSuccess || !itemQuery.data || !itemQuery.data[0]) return;

    const item = itemQuery.data[0];

    const columnValues: Record<string, string | string[]> = {};

    item.column_values.forEach((columnValue) => {
      if (!columnValue.value) return;

      switch (columnValue.type) {
        case "multiple-person":
        case "person":
          columnValues[`column_data_${columnValue.id}`] =
            (
              JSON.parse(columnValue.value || "{}") as {
                personsAndTeams: { kind: string; id: string; name: string }[];
              }
            )?.personsAndTeams
              ?.filter((e) => e.kind === "person")
              .map((e) => e.id.toString()) ?? [];

          break;

        case "color":
          columnValues[`column_data_${columnValue.id}`] = JSON.parse(
            columnValue.value || "{}"
          )?.index.toString();

          break;

        case "dropdown":
          columnValues[`column_data_${columnValue.id}`] = JSON.parse(
            columnValue.value || "{}"
          )?.ids;

          break;

        case "date":
          columnValues[`column_data_${columnValue.id}`] = JSON.parse(
            columnValue.value || "{}"
          )?.date;

          break;

        case "text":
        case "numeric":
          columnValues[`column_data_${columnValue.id}`] = JSON.parse(
            columnValue.value
          ) as string;
      }
    });

    reset({
      name: item.name,
      id: item.id,
      workspace: item.workspace_id ?? null,
      board: {id: item.board.id, name: item.board.name},
      group: item.group.id,
      ...columnValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemQuery.isSuccess, id, reset]);

  useEffect(() => {
    if (!submitMutation.isSuccess) return;

    (async () => {
      !isEditMode &&
        (await linkItems([
          submitMutation.data.data?.create_item?.id as string,
        ]));

      navigate(!id ? "/redirect" : `/view/item/${id}`);
    })();
  }, [
    submitMutation.isSuccess,
    navigate,
    linkItems,
    id,
    submitMutation.data,
    isEditMode,
  ]);

  useEffect(() => {
    if (inputs.length === 0) return;

    const newObj: { [key: string]: ZodTypeAny } = {};
    inputs.forEach((field) => {
      if (field.required) {
        newObj[field.name] = z.string().nonempty();
      } else if (field.name === "workspace") {
        newObj[field.name] = z.string().or(z.number()).nullable();
      } else {
        newObj[field.name] = z.string().optional();
      }

      // Update the schema for the `board` field when in edit mode
      if (isEditMode && field.name === "board"){
        console.log("[LOG] board in edit mode reached")
        newObj[field.name] = z.object({
  id: z.string(),
  name: z.string()
}).required();
      }

    });

    newObj.column_values = z.record(z.any()).optional();

    setSchema(getItemSchema(inputs, newObj));
  }, []);

  const workspaces = useMemo(() => {
    if (!workspacesQuery.isSuccess) return [];

    const workspacesPath = workspacesQuery.data?.data.workspaces;

    return [
      ...workspacesPath.map((workspace) => ({
        key: workspace.name,
        value: workspace.id,
      })),
      {
        key: "Main Workspace",
        value: null,
      },
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspacesQuery.isSuccess]);

  const boards = useMemo(() => {
    if (!boardsQuery.isSuccess) return [];

    const boardsPath = boardsQuery.data?.data.boards;

    return boardsPath.map((board) => ({
      key: board.name,
      value: board.id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardsQuery.isSuccess]);

  const users = useMemo(() => {
    if (!usersQuery.isSuccess) return [];

    const usersPath = usersQuery.data?.data?.users;

    return usersPath?.map((board) => ({
      key: board.name,
      value: board.id.toString(),
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardsQuery.isSuccess]);

  const groups = useMemo(() => {
    if (!boardsQuery.isSuccess || !selectedBoard) return [];

    const groupsPath = boardsQuery.data?.data.boards.find(
      (e) => e.id === selectedBoard
    )?.groups;

    if (!groupsPath) return [];

    return groupsPath?.map((group) => ({
      key: group.title,
      value: group.id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardsQuery.isSuccess, selectedBoard]);

  const dropdownData = useMemo(() => {
    return {
      ...getDropdownDataForObject(columnData, {
        users: users,
        ...dataInsertedDropdown,
      }),
    };
  }, [users, columnData, dataInsertedDropdown]);

  const onDropdownChange = async (
    string: string,
    keyName: string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      setDataInsertedDropdown({
        ...dataInsertedDropdown,
        [keyName]: dataInsertedDropdown[keyName]?.filter((e) => e !== string),
      });

      return;
    }
    setDataInsertedDropdown({
      ...dataInsertedDropdown,
      [keyName]: [...(dataInsertedDropdown[keyName] ?? []), string],
    });
  };

  if (
    (!isEditMode && !workspacesQuery.isSuccess) ||
    (isEditMode && !itemQuery.isSuccess) ||
    !usersQuery.isSuccess
  )
    return <LoadingSpinnerCenter />;

  return (
    <form
      onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
      style={{ width: "100%" }}
    >
      <Stack vertical style={{ width: "100%" }} gap={6}>
        <InputWithTitleRegister
          register={register("name")}
          required
          error={!!errors.name}
          title="Name"
          data-testid="input-name"
          type="text"
        />
        {!isEditMode && (
          <DropdownSelect
            title="Workspace"
            required={true}
            error={!!errors.workspace}
            data={workspaces}
            onChange={(e) => {
              setValue("workspace", e);
              setValue("board", undefined);
              setValue("group", undefined);
            }}
            value={watch("workspace")}
          />
        )}
        {!isEditMode ? (
          boardsQuery.isFetching ? (
            <LoadingSpinnerCenter />
          ) : (
            boardsQuery.isSuccess &&
            selectedWorkspace !== undefined && (
              <DropdownSelect
                title="Board"
                error={!!errors.boards}
                required={true}
                data={boards}
                onChange={(e) => {
                  setValue("board", e);
                  setValue("group", undefined);
                }}
                value={watch("board")}
              />
            )
          )
        ) : (
          false
        )}
        {columnsQuery.isFetching ? (
          <LoadingSpinnerCenter />
        ) : (
          columnsQuery.isSuccess &&
          selectedBoard && (
            <>
              {!id && (
                <DropdownSelect
                  title="Group"
                  error={!!errors.groups}
                  required={false}
                  data={groups}
                  onChange={(e) => setValue("group", e)}
                  value={watch("group")}
                />
              )}
              <FieldMappingInput
                onDropdownChange={onDropdownChange}
                errors={errors}
                fields={columnData}
                register={register}
                setValue={setValue}
                watch={watch}
                dropdownData={dropdownData}
              />
              <Stack style={{ width: "100%", justifyContent: "space-between" }}>
                
                <Button
                  type="submit"
                  data-testid="button-submit"
                  text={id ? "Save" : "Create"}
                  loading={!submitMutation.isIdle}
                  disabled={!submitMutation.isIdle}
                  intent="primary"
                ></Button>
                {!!id && (
                  <Button
                    text="Cancel"
                    onClick={() => navigate(`/view/item/${id}`)}
                    intent="secondary"
                  ></Button>
                )}
              </Stack>
            </>
          )
        )}
      </Stack>
    </form>
  );
};
