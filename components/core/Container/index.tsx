import { cn } from "@/lib/utils";

type T_Container = {
  children: React.ReactNode;
  title: string;
  description: string;
  subtitle?: React.ReactNode;
  className?: string;
}

const Container = ({ children, title, description, subtitle, className }: T_Container) => {
  return (
    <div className={cn("flex flex-col w-full gap-4", className)} >
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{description}</p>
        </div>
        {subtitle ? <div className="text-mono">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}

export default Container