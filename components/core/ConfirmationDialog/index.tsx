"use client";

import { Button } from "@/components/ui/button";
import DialogCore from "../Dialog";
import { useConfirmStore } from "@/store/useConfirmStore";
import Icon from "../Icon";

const ConfirmationDialog = () => {
  const { open, config, isLoading, close, setLoading } = useConfirmStore();
  
  if (!config) return null;

  const handleOnCancel = () => {
    if (config.onCancel) config.onCancel();
    close();
  }

  const handleOnSubmit = async () => {
    if (!config.onSubmit) return;

    try {
      setLoading(true);
      await config.onSubmit();
      close();
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DialogCore
      open={open}
      onOpenChange={(isOpen) => !isOpen && close()}
      title={config.title}
      description={config.description}
      content={
        <div className="flex flex-col gap-4 text-center items-center">
          {config.content}

          <div className="flex gap-2 items-center">
            <Button onClick={handleOnCancel} variant="outline" disabled={isLoading}>
              {config.cancelButtonText ?? "Cancel"}
            </Button>
            <Button onClick={handleOnSubmit} variant="default" disabled={isLoading}>
              {isLoading && <Icon icon="LuLoader" className="animate-spin" />}
              {config.submitButtonText ?? "Submit"}
            </Button>
          </div>
        </div>
      }
    />
  );
}

export default ConfirmationDialog;