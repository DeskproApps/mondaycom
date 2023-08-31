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

jest.mock("../../../src/api/api", () => {
  return {
    getItemsById: () => [
      {
        id: "123",
        board_id: "123",
        name: "Item 1",
        workspace: "Epic Workspace",
        board: "Epic Board",
        group: "Epic Group",
        column_values: [],
        updates: [],
      },
    ],
  };
});

describe("View", () => {
  test("View page should show a contact correctly", async () => {
    const { getByText } = renderPage();

    const name = await waitFor(() => getByText(/Item 1/i));

    const board = await waitFor(() => getByText(/Epic Board/i));

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
