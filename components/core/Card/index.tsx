import Icon, { T_IconList } from "@/components/core/Icon";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type T_CardCore = {
  className?: string;
  children: React.ReactNode;
  contentClassName?: string;

  title?: string;
  titleIcon?: T_IconList;
  titleClassName?: string;
  
  subtitle?: React.ReactNode;
  subtitleClassName?: string;

  footer?: React.ReactNode;
  footerClassName?: string;
}

const CardCore = ({
  children,
  className,
  contentClassName,
  title,
  titleIcon,
  titleClassName,
  subtitle,
  subtitleClassName,
  footer,
  footerClassName,
}: T_CardCore) => {
  return (
    <Card className={cn("hover:ring-twilight-500 transition-all duration-200!", className)}>
      {title || titleIcon || subtitle
      ? <CardHeader className="flex gap-4 items-center">
          <div className={cn("flex gap-2 text-muted-foreground items-center", titleClassName)}>
            {titleIcon ? <Icon icon={titleIcon} /> : null}
            {title ? <p className="text-mono">{title}</p> : null}
          </div>
          {subtitle ? <div className={cn("ml-auto text-mono", subtitleClassName)}>{subtitle}</div> : null}
        </CardHeader>
      : null}
      
      <CardContent className={cn("flex flex-col h-full gap-4", contentClassName)}>
        {children}
      </CardContent>

      {footer
      ? <CardFooter className={cn("flex m-4 px-0 pb-0 gap-4 bg-transparent rounded-0", footerClassName)}>
          {footer}
        </CardFooter>
      : null}
    </Card>
  );
}

export default CardCore;