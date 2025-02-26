import { Stack } from "@deskpro/deskpro-ui";
import styled from "styled-components";

const StyledErrorBlock = styled(Stack)`
width: 100%;
margin-bottom: 8px;
padding: 4px 6px;
border-radius: 4px;
font-size: 12px;
color: ${({ theme }) => theme.colors.white};
background-color: ${({ theme }) => theme.colors.red100};
`;

export default StyledErrorBlock