import { useParams } from "react-router-dom";
import { MutateItem } from "../../components/Mutate/Item";

export const EditItem = () => {
  const { itemId } = useParams();

  if (!itemId) return <div />;

  return <MutateItem id={itemId} />;
};
