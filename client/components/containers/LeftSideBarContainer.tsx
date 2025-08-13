import { useParams } from "next/navigation";
import LeftSideBar from "../organisms/LeftSideBar";
import { useQuery } from "@tanstack/react-query";
import { getFormWithBlocks } from "@/services/form";
import { BlockType } from "@/types";
import { BlockTypeMap } from "@/constants";

type LeftSideBarProps = {
  handleOpenChooseBlockModal: () => void;
};

export default function LeftSideBarContainer({
  handleOpenChooseBlockModal,
}: LeftSideBarProps) {
  const params = useParams();
  const formId = params.formId as string;

  const { data } = useQuery({
    queryKey: ["forms", formId, "blocks"],
    queryFn: () => getFormWithBlocks(formId),
    enabled: !!formId,
  });

  console.log("formId", formId, data);

  const formBlocks = (data?.blocks || []).map((block: BlockType) => ({
    ...block,
    color: BlockTypeMap[block.type].color,
  }));

  console.log("why it is not changed", formBlocks, data);
  return (
    <LeftSideBar
      handleOpenChooseBlockModal={handleOpenChooseBlockModal}
      formBlocks={formBlocks}
    />
  );
}
