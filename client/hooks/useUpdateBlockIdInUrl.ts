import { useRouter, useSearchParams } from "next/navigation";

const useUpdateBlockIdInUrl = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBlockId = searchParams.get("block_id");

  if (!currentBlockId) {
    throw new Error("No Block ID");
  }
  const handleChangeBlockId = (newBlockId: string) => {
    const pathname = window.location.pathname;
    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.set("block_id", newBlockId);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return { currentBlockId, handleChangeBlockId };
};

export default useUpdateBlockIdInUrl;
