import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react/";
import * as Api from "../../../src/api/api";
import React from "react";
import { MutateItem } from "../../../src/components/Mutate/Item";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <MutateItem id="123" />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getItemsById: () => [
      {
        id: "123",
        board_id: "123",
        name: "asd",
        column_values: [],
        group_id: "123",
        group: {
          id: "123",
        },
      },
    ],
    getUsers: () => ({ data: { userss: [{ id: "123", name: "Name" }] } }),
    getBoardColumns: () => ({ data: { boards: [{ columns: [{}] }] } }),
    editItem: jest.fn(),
  };
});

describe("Edit Page", () => {
  test("Editing an Item should work correctly", async () => {
    const { getByTestId } = renderPage();
    fireEvent(getByTestId("button-submit"), new MouseEvent("click"));

    await waitFor(() => {
      fireEvent(getByTestId("button-submit"), new MouseEvent("click"));

      expect(Api.editItem).toBeCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
