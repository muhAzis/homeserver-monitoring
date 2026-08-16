import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, ControllerRenderProps, FormState, UseFormReset, UseFormWatch, useForm } from "react-hook-form";
import Icon, { T_IconList } from "../Icon";
import Inputs, { spans } from "./Inputs";
import { cn } from "@/lib/utils";
import FieldArray from "./FieldArray";
import { useEffect } from "react";

type T_SelectOption = {
  label: string | React.ReactNode;
  value: string;
}

export type T_Field = {
  subFields?: (watch: UseFormWatch<any>) => T_Field[];
  defaultSubFieldCount?: number;
  name: string;
  label?: React.ReactNode;
  type?: string;
  placeholder?: string;
  description?: string;
  icon?: T_IconList;
  iconSize?: number;
  iconOnClick?: () => void;
  onChange?: (value?: any) => void;
  options?: T_SelectOption[];
  fileAccept?: string[];
  maxFileSize?: number;
  fileSize?: number;
  hidden?: boolean;
  colSpan?: 1 | 2 | 3 | 4;
  content?: (watch: UseFormWatch<any>) => React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

type T_Form = {
  schema: any;
  onSubmit: (data: any) => void;
  fields: T_Field[] | ((watch: UseFormWatch<any>) => T_Field[]);
  defaultValues: any;
  isLoading?: boolean;
  className?: string;
  submitText?: string;
  customSubmitButton?: (formState?: FormState<any>) => React.ReactNode;
  values?: any;
  resetValues?: boolean;
  isCancelButton?: boolean;
  onCancel?: () => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

const Form = ({
  schema,
  onSubmit,
  fields,
  defaultValues,
  isLoading,
  className,
  submitText,
  customSubmitButton,
  values,
  resetValues = true,
  isCancelButton = false,
  onCancel,
  isDisabled,
  isReadOnly
}: T_Form) => {
  const {
    control,
    handleSubmit,
    watch,
    formState,
    trigger,
    register,
    reset
  } = useForm({
    resolver: zodResolver(schema),
    values,
    defaultValues
  });

  const renderInput = (field: ControllerRenderProps<any, string>, item: T_Field) => {
    switch (item?.type) {
      case "checkbox":
        return (
          <Inputs.Checkbox
            field={field}
            item={item}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            schema={schema}
            formState={formState}
            trigger={trigger}
          />
        );
      case "select":
        return (
          <Inputs.Select
            field={field}
            item={item}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            schema={schema}
            formState={formState}
            trigger={trigger}
          />
        )
      case "textarea":
        return (
          <Inputs.TextArea
            field={field}
            item={item}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            schema={schema}
            formState={formState}
            trigger={trigger}
          />
        )
      case "file":
        return (
          <Inputs.File
            field={field}
            item={item}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            schema={schema}
            formState={formState}
            trigger={trigger}
          />
        )
      default:
        return (
          <Inputs.Text
            field={field}
            item={item}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            schema={schema}
            formState={formState}
            trigger={trigger}
          />
        )
    }
  }

  const onSubmitForm = async (data: any) => {
    await onSubmit(data);
    if (resetValues) reset(defaultValues);
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={cn(className)}>
      <FieldGroup className="gap-2">
        <div className="grid grid-cols-4 gap-x-4 gap-y-4">
          {(typeof fields === "function" ? fields(watch) : fields)?.filter((item) => !item.hidden).map((item) =>
            item.type === "list" && item.subFields
              ? <FieldArray
                key={`field-${item?.name}`}
                field={item}
                control={control}
                register={register}
                watch={watch}
                schema={schema}
                trigger={trigger}
                formState={formState}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
              />
              : item.type !== "component"
                ? <Controller
                  key={`field-${item?.name}`}
                  control={control}
                  name={item.name}
                  render={({ field }) => renderInput(field, item)}
                />
                : <div key={`field-component-${item?.name}`} className={cn(spans(item?.colSpan ?? 4), item?.className)}>
                  {item.content ? item?.content(watch) : <></>}
                </div>
          )}
        </div>

        {!customSubmitButton
          ? <div className="flex w-full mt-8 gap-2 items-center justify-end">
            {isCancelButton
              ? <Button
                type="button"
                disabled={isLoading}
                className="w-fit"
                size="lg"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              : null}
            <Button
              type="submit"
              disabled={isLoading || !formState.isDirty}
              className="w-fit"
              size="lg"
            >
              {isLoading ? <Icon icon="LuLoader" className="animate-spin" /> : null}
              {submitText ?? (isLoading ? "Submitting..." : "Submit")}
            </Button>
          </div>
          : customSubmitButton(formState)}
      </FieldGroup>
    </form>
  );
}

export default Form;