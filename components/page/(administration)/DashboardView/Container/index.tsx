import { cn } from "@/lib/utils";

type T_Container = {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Container = ({ children, title, description, className }: T_Container) => {
  return (
    <div className={cn("flex flex-col w-full gap-4", className)} >
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default Container