import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react/";
import createNote from "../../../src/api/monday/createNote";
import React from "react";
import { CreateNote } from "../../../src/pages/Create/Note";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <CreateNote />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/monday/createNote", () => jest.fn());

describe("Create Note", () => {
  test("Creating a note should work correctly", async () => {
    const { getByTestId } = renderPage();

    fireEvent.change(getByTestId("note-input"), {
      target: { value: "A note" },
    });

    fireEvent.click(getByTestId("button-submit"));

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledTimes(1);
    });
  });

  test("Creating a note with no content should fail", async () => {
    const { getByTestId } = renderPage();

    fireEvent.click(getByTestId("button-submit"));

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledTimes(0);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
