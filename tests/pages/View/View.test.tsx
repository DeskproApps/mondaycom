import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { ViewItem } from "../../../src/pages/View/Item";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ViewItem />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/monday/getItemsById", () => () => ([
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
]))
  
describe("View", () => {
  test("View page should show a contact correctly", async () => {
    const { getByText } = renderPage();

    const name = await waitFor(() => getByText(/Fake Item/i));

    const board = await waitFor(() => getByText(/DeskproBoard/i));

    const workspace = await waitFor(() => getByText(/Epic Workspace/i));

    await waitFor(() => {
      [name, board, workspace].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});