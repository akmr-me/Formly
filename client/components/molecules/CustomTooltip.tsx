import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type CustomTooltipProps = {
  children: React.ReactNode;
  hoverContent: React.ReactNode;
};
export default function CustomTooltip({
  children,
  hoverContent,
}: CustomTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{hoverContent}</TooltipContent>
    </Tooltip>
  );
}
