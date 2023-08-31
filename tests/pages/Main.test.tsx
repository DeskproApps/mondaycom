import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { Main } from "../../src/pages/Main";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/api/api", () => {
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
      },
    ],
  };
});

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const workspace = await waitFor(() => getByText(/Epic Workspace/i));

    const board = await waitFor(() => getByText(/Epic Board/i));

    await waitFor(() => {
      [workspace, board].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
