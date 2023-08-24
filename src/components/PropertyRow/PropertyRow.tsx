import { Stack } from "@deskpro/deskpro-ui";
import styled from "styled-components";

import { ReactElement } from "react";

const Divider = styled.div`
  display: inline-block;
  min-width: 1px;
  background-color: ${({ theme }) => theme.colors.grey20};
  margin: 0px 6px 0px 0px;
`;

export const PropertyRow = ({ children }: { children: ReactElement[] }) => {
  const maxHeight = Math.max(
    ...Array.from(document.querySelectorAll(".property-row")).map(
      (row) => row.clientHeight
    )
  );

  return (
    <Stack
      style={{
        position: "relative",
        width: "100%",
        height: `${maxHeight}px` || "100%",
      }}
    >
      {children.map((child, idx) => (
        <Stack
          key={idx}
          className="property-row"
          style={{
            position: idx === 0 ? "relative" : "absolute",
            width: `${idx === 0 ? 100 : 100 / children.length}%`,
            left: `${idx * (100 / children.length)}%`,
          }}
        >
          {idx !== 0 && (
            <Divider style={{ height: `${maxHeight}px` || "100%" }} />
          )}
          <Stack
            style={{ maxWidth: `${(idx + 1) * (100 / children.length) - 5}%` }}
          >
            {child}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
