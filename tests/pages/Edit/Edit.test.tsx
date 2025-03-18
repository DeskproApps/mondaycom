import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react/";
import editItem from "../../../src/api/monday/editItem";
import React from "react";
import { MutateItem } from "../../../src/components/Mutate/Item";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <MutateItem id="123" />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/monday/editItem", () => jest.fn());
jest.mock("../../../src/api/monday/getBoardColumns", () => () => ({ data: { boards: [{ columns: [] }] } }));
jest.mock("../../../src/api/monday/getUsers", () => () => ({ data: { users: [{ id: "123", name: "John Doe" }] } }));
jest.mock("../../../src/api/monday/getItemsById", () => () => [
  {
    id: "123456",
    name: "Fake Item",
    state: "active",
    created_at: "2025-01-16T17:10:26Z",
    group: {
      id: "topics",
      name: "Epic Group"
    },
    board: {
      id: "1234565789",
      name: "DeskproBoard",
    },
    workspace: "Epic Workspace",
    column_values: [],
    creator: {
      id: "789",
      name: "John Doe"
    },
    updates: [],
  },
],);


// jest.mock("../../../src/api/api", () => {
//   return {
//     getItemsById: () => [
//       {
//         id: "123456",
//         name: "Fake Item",
//         state: "active",
//         created_at: "2025-01-16T17:10:26Z",
//         group: {
//           id: "topics",
//           name: "Epic Group"
//         },
//         board: {
//           id: "1234565789",
//           name: "DeskproBoard",
//         },
//         workspace: "Epic Workspace",
//         column_values: [],
//         creator: {
//           id: "789",
//           name: "John Doe"
//         },
//         updates: [],
//       },
//     ],
//     getUsers: () => ({ data: { users: [{ id: "123", name: "John Doe" }] } }),
//     getBoardColumns: () => ({ data: { boards: [{ columns: [] }] } }),
//     editItem: jest.fn(),
//   };
// });

describe("Edit Page", () => {
  test("Editing an Item should work correctly", async () => {
    const { getByTestId } = renderPage();
    fireEvent(getByTestId("button-submit"), new MouseEvent("click"));

    await waitFor(() => {
      fireEvent(getByTestId("button-submit"), new MouseEvent("click"));

      expect(editItem).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
