import BlockInfo, { BlockInfoProps } from "@/components/molecules/BlockInfo";
import useUpdateBlockIdInUrl from "@/hooks/useUpdateBlockIdInUrl";

export default function BlockInfoLeftSidebarContainer(props: BlockInfoProps) {
  const { handleChangeBlockId, currentBlockId } = useUpdateBlockIdInUrl();

  return (
    <BlockInfo
      selectedBlockid={currentBlockId}
      onClickHandler={handleChangeBlockId}
      {...props}
    />
  );
}
