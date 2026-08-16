"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import Inputs from "../Form/Inputs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "../Icon";
import { cn } from "@/lib/utils";

const chatSchema = z.object({
  chat: z.string().min(1, "Please enter a message"),
})

export type T_ChatSchema = z.infer<(typeof chatSchema)>;

type T_CharForm = {
  onSubmit: (data: T_ChatSchema) => void;
  defaultValues?: T_ChatSchema;
  isLoading?: boolean;
}

const ChatForm = ({onSubmit, defaultValues, isLoading}: T_CharForm) => {
  const [isLong, setIsLong] = useState<boolean>(false);
  
  const {
    control,
    handleSubmit,
    watch,
    formState,
    trigger,
    reset
  } = useForm({
    resolver: zodResolver(chatSchema),
    // defaultValues,
    values: defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const chatLength = watch("chat")?.length;

    setIsLong(((prev) => {
      if (chatLength >= 45) {
        return true;
      }

      if (chatLength <= 0) {
        return false;
      }

      return false;
    }));
  }, [watch("chat")]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading) return;
      handleSubmit(onSubmit)(); 
      reset({
        chat: "",
      });
    }
  };
  
  return (
    <div className={cn("p-4 gap-2 bg-card border", isLong ? "rounded-3xl" : "rounded-full")}>
      <form onSubmit={handleSubmit(onSubmit)} className={cn("flex gap-4", isLong ? "flex-col items-end" : "items-center")}>
        <Controller
          control={control}
          name="chat"
          render={({ field }) => 
            <Inputs.TextArea
              field={{
                ...field,
                onKeyDown: handleKeyDown
              } as any}
              item={{
                name:"chat",
                placeholder: "Ask TIARA",
                className: "min-h-10! bg-transparent! border-0! shadow-none! focus-visible:ring-0! focus-visible:ring-offset-0! resize-none!"
              }}
              isDisabled={isLoading}
              // isReadOnly={isReadOnly}
              schema={chatSchema as any}
              formState={formState}
              trigger={trigger}
            />
          }
        />

        <Button className="w-fit h-fit p-3 rounded-full" type="submit" disabled={isLoading}>
          <Icon icon={isLoading ? "LuLoaderCircle" : "LuSend"} className={cn(isLoading ? "animate-spin" : "")} />
        </Button>
      </form>
    </div>
  );
}

export default ChatForm;