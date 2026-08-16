import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Icon, { T_IconList } from "../Icon";
import { cn } from "@/lib/utils";

export type T_Tabs = {
  tabs: {
    label: string;
    value: string;
    content: React.ReactNode;
    leftIcon?: T_IconList;
    rightIcon?: T_IconList;
  }[];
  defaultActive?: string;
  onChange?: (value: string) => void;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const TabsCore = ({ tabs, defaultActive, onChange, className, listClassName, triggerClassName, contentClassName }: T_Tabs) => {
  return (
    <Tabs
      defaultValue={defaultActive}
      className={cn(
        className,
        "flex flex-col bg-card border rounded-2xl overflow-hidden"
      )}
    >
      <TabsList
        className={cn(
          listClassName,
          "w-full p-0 bg-transparent rounded-none border-b justify-start"
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              triggerClassName,
              "flex-0 w-fit! m-0! p-0!", //base UI default counterfeit
              "p-4! data-active:text-primary-500 data-active:border-0 data-active:border-b-2 data-active:border-b-primary-500 rounded-none"
            )}
          >
            {tab.leftIcon && <Icon icon={tab.leftIcon} />}
            {tab.label}
            {tab.rightIcon && <Icon icon={tab.rightIcon} />}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={contentClassName}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default TabsCore