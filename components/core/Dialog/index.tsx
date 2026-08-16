import { Button, T_Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type T_DialogCore = {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opener?: T_Button & {label?: string | React.ReactNode};
  closer?: T_Button & {label?: string | React.ReactNode};
  footer?: React.ReactNode;
  contentClassName?: string;
  footerClassName?: string;
  headerClassName?: string;
}

const DialogCore = ({
  title,
  description,
  content,
  open,
  onOpenChange,
  opener,
  closer,
  footer,
  contentClassName,
  footerClassName,
  headerClassName
}: T_DialogCore) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {opener
      ? <DialogTrigger render={<Button {...opener}>{opener.label ?? "Open Dialog"}</Button>} />
      : null}
      <DialogContent className={cn(contentClassName)}>
        <DialogHeader className={cn(headerClassName)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto overflow-x-visible! scrollbar-none">
          {content}
        </div>
        {footer
        ? <DialogFooter className={cn(footerClassName)}>
            {closer
            ? <DialogClose render={<Button {...closer}>{closer.label ?? "Cancel"}</Button>} />
            : null}
            {footer}
          </DialogFooter>
        : null}
      </DialogContent>
    </Dialog>
  )
}

export default DialogCore