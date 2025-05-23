import { cleanup, render, waitFor } from "@testing-library/react/";
import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { Main } from "../../src/pages/Main";
import React from "react";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/api/monday/getItemsById", () => () => [
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
]);

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const workspace = await waitFor(() => getByText(/Epic Workspace/i));

    const board = await waitFor(() => getByText(/DeskproBoard/i));

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