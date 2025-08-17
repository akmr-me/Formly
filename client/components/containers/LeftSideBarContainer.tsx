import { useParams } from "next/navigation";
import LeftSideBar from "./LeftSideBar";
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

  // ✅ correctly access nested data
  const formBlocks =
    data?.data?.blocks?.map((block: BlockType) => ({
      ...block,
      color: BlockTypeMap[block.type].color,
    })) || [];

  return (
    <LeftSideBar
      handleOpenChooseBlockModal={handleOpenChooseBlockModal}
      formBlocks={formBlocks}
    />
  );
}
