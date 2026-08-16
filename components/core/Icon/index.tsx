import { cn } from '@/lib/utils';
import * as Lucide from 'react-icons/lu';

export type T_IconList = keyof typeof Lucide;

type T_Icon = {
  icon: T_IconList;
  className?: string;
  size?: number;
  onClick?: () => void;
  buttonVariant?: "primary" | "secondary" | "ghost" | "destructive" | "outline" | "blue" | "emerald";
  disabled?: boolean
};

const Icon = ({ icon, className, size, onClick, buttonVariant = 'secondary', disabled }: T_Icon) => {
  const buttonIconMap = {
    primary: cn("text-primary hover:text-primary-500/50", disabled ? "text-primary-200! dark:text-primary-500/30" : ""),
    secondary: cn("text-dark-400 hover:text-dark-400/50", disabled ? "text-dark-200! dark:text-dark-500/30" : ""),
    ghost: cn("text-dark-100 hover:text-dark-100/50", disabled ? "text-dark-200! dark:text-dark-500/30" : ""),
    destructive: cn("text-primary-500 hover:text-primary-500/50", disabled ? "text-primary-200! dark:text-primary-500/30" : ""),
    outline: cn("text-dark-100 hover:text-dark-100/50", disabled ? "text-dark-200! dark:text-dark-500/30" : ""),
    blue: cn("text-blue-500 hover:text-blue-500/50", disabled ? "text-blue-200! dark:text-blue-500/30" : ""),
    emerald: cn("text-emerald-500 hover:text-emerald-500/50", disabled ? "text-emerald-200! dark:text-emerald-500/30" : ""),
  };
  
  const Icon = Lucide[icon];
  return (
    <Icon
      size={size?? 16}
      className={cn(
        className,
        !disabled && onClick ? "hover:cursor-pointer" : "",
        onClick && buttonVariant ? buttonIconMap[buttonVariant] : "")
      }
      onClick={disabled ? undefined : onClick}
    />
  );
}

export default Icon