import BlockInfo, { BlockInfoProps } from "@/components/molecules/BlockInfo";
import useUpdateBlockIdInUrl from "@/hooks/useUpdateBlockIdInUrl";

export default function BlockInfoLeftSidebarContainer(props: BlockInfoProps) {
  const { handleChangeBlockId, currentBlockId } = useUpdateBlockIdInUrl();

  return (
    <BlockInfo
      selectedBlockId={currentBlockId}
      onClickHandler={handleChangeBlockId}
      {...props}
    />
  );
}
