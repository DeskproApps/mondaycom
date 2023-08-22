import { H1 } from "@deskpro/deskpro-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledLink = styled(Link)`
  all: unset;
  font-size: 12px;
  color: ${({ theme, to }) =>
    to ? theme.colors.cyan100 : theme.colors.black100};
  text-decoration: none;
  font-weight: 500;
  cursor: ${({ to }) => (to ? "pointer" : "default")};
`;

export const Title = styled(H1)`
  color: ${({ theme }) => theme.colors.grey100};
  font-size: 12px;
`;

export const FontAwesomeIconHover = styled(FontAwesomeIcon)`
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
  &:visited {
    text-decoration: none;
    color: orange;
  }
`;
