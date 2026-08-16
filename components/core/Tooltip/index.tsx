import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type T_TooltipCore = {
  children: React.ReactElement;
  content: React.ReactNode;
  className?: string;
  open?: boolean;
}

const TooltipCore = ({
  children,
  content,
  className,
  open
}: T_TooltipCore) => {
  return (
    <Tooltip open={open} >
      <TooltipTrigger render={children} />
      <TooltipContent>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export default TooltipCore