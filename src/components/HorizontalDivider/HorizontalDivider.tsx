import {
  HorizontalDivider as HorizontalDividerSDK,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
type Props = {
  full?: boolean;
  style?: React.CSSProperties;
};
export const HorizontalDivider = ({ full, style }: Props) => {
  const { theme } = useDeskproAppTheme();
  return (
    <HorizontalDividerSDK
      style={{
        width: "110vw",
        color: theme?.colors.grey10,
        marginLeft: full ? "-26px" : "0px",
        ...style,
      }}
    />
  );
};
