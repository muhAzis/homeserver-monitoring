import { ControllerRenderProps, FormState, UseFormTrigger } from "react-hook-form";
import { T_Field } from "..";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZodEffects } from "zod/v3";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import Icon from "../../Icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type T_Inputs = {
  Checkbox: React.FC<T_InputDetail>;
  Select: React.FC<T_InputDetail>;
  File: React.FC<T_InputDetail>;
  Text: React.FC<T_InputDetail>;
  TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & T_InputDetail>;
}

type T_InputDetail = {
  field: ControllerRenderProps<any, string>;
  item: T_Field;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  schema: ZodEffects<any>;
  formState: FormState<any>;
  trigger: UseFormTrigger<any>;
}

export const spans = (span: T_Field['colSpan']) => {
  switch(span) {
    case 1:
      return 'col-span-1';
    case 2:
      return 'col-span-2';
    case 3:
      return 'col-span-3';
    default:
      return 'col-span-4';
  }
}

export const isFieldRequired = (schema: any, fieldName: string): boolean => {
  let currentSchema = schema;

  while (currentSchema instanceof ZodEffects) {
    currentSchema = currentSchema.innerType();
  }

  if (currentSchema instanceof z.ZodObject) {
    const field = currentSchema.shape[fieldName];
    
    if (!field) return false;
    
    return !field.isOptional();
  }

  return false;
}

const CheckboxCore = ({
  field,
  item,
  isDisabled,
  isReadOnly
}: T_InputDetail) => {
  return (
    <Field orientation="horizontal" className={cn(spans(item?.colSpan?? 4))}>
      <Checkbox
        id={item.name}
        name={item.name}
        checked={field.value}
        onCheckedChange={field.onChange}
        disabled={item?.isDisabled || isDisabled}
        readOnly={item?.isReadOnly || isReadOnly}
      />
      <Label htmlFor={item.name}>
        {item.label}
      </Label>
    </Field>
  );
}

const SelectCore = ({
  field,
  item,
  isDisabled,
  isReadOnly,
  schema,
  formState
}: T_InputDetail) => {
  return (
    <Field className={cn(spans(item?.colSpan?? 4), "gap-1")}>
      {item?.label
      ? <FieldLabel
          htmlFor={item?.name}
          className="font-semibold gap-1"
        >
          {item.label}
          {isFieldRequired(schema, item.name) && <span className="text-primary-500">*</span>}
        </FieldLabel>
      : null}

      <Select
        items={item.options}
        onValueChange={field.onChange}
        value={field.value}
        readOnly={item?.isReadOnly || isReadOnly}
        disabled={item?.isDisabled || isDisabled}
      >
        <SelectTrigger className="w-48 h-12!">
          <SelectValue placeholder={item.placeholder?? "Select Option"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {item.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {item?.description
      ? <FieldDescription className="mt-0.5! text-xs text-dark-400">{item.description}</FieldDescription>
      : null}

      {formState.errors[item.name]
      ? <FieldError className="text-xs text-red-600">{`${(formState.errors[item.name] as any)?.message}`}</FieldError>
      : null}
    </Field>
  );
}

const TextAreaCore = ({
  field,
  item,
  isDisabled,
  isReadOnly,
  schema,
  formState,
  trigger,
  onKeyDown,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & T_InputDetail) => {
  return (
    <Field className={cn(spans(item?.colSpan?? 4), "gap-1")}>
      {item?.label
      ? <FieldLabel
          htmlFor={item?.name}
          className="font-semibold gap-1"
        >
          {item.label}
          {isFieldRequired(schema, item.name) && <span className="text-primary-500">*</span>}
        </FieldLabel>
      : null}

      <Textarea
        {...props}
        {...field}
        id={item.name}
        className={cn("p-4 min-h-30! max-h-60! font-mono", item?.className)}
        placeholder={item?.placeholder}
        onChange={(e) => {
          field.onChange(e);
          if (item.onChange) {
            item?.onChange(trigger);
          }
        }}
        readOnly={item?.isReadOnly || isReadOnly}
        disabled={item?.isDisabled || isDisabled}
      />

      {item?.description
      ? <FieldDescription className="mt-0.5! text-xs text-dark-400">{item.description}</FieldDescription>
      : null}

      {formState.errors[item.name]
      ? <FieldError className="text-xs text-red-600">{`${(formState.errors[item.name] as any)?.message}`}</FieldError>
      : null}
    </Field>
  );
}

const FileCore = ({
  field,
  item,
  isDisabled,
  isReadOnly,
  schema,
  formState,
}: T_InputDetail) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Mengembalikan tampilan saat file keluar dari area div
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      field.onChange(droppedFiles[0]);
    }
  };
  
  return (
    <Field className={cn(spans(item?.colSpan?? 4), "gap-1")}>
      {item?.label
      ? <FieldLabel
          htmlFor={item?.name}
          className="font-semibold gap-1"
        >
          {item.label}
          {isFieldRequired(schema, item.name) && <span className="text-primary-500">*</span>}
        </FieldLabel>
      : null}
      
      <label
        htmlFor="file"
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-primary-50/30 dark:bg-primary-500/10 px-6 py-10 text-center cursor-pointer hover:bg-primary-50/50 dark:hover:bg-primary-500/20 transition-all overflow-hidden",
          (item?.isDisabled || isDisabled) && "opacity-50 cursor-not-allowed",
          isDragging && "border-primary-500 bg-primary-50 dark:bg-primary-500/20 border-solid scale-[1.01]"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* <div className={cn(
          "absolute w-[100px] aspect-square bg-primary-500 rounded-full blur-3xl transition-all duration-300 ease-out",
          isDragging ? "inset-0 opacity-100" : "-inset-full opacity-0"
        )} /> */}

        <div className={cn("relative grid h-10 w-10 rounded-full transition-colors duration-500 place-items-center", isDragging ? "text-light-1 bg-primary-500" : "text-primary-500 bg-primary-100 dark:bg-primary-500/20")}>
          <Icon icon={isDragging ? "LuFileDown" : "LuFileUp"} size={20} className={cn(isDragging ? "animate-bounce" : "")} />
        </div>
        {field.value ? (
          <>
            <div className="relative flex items-center gap-2">
              <span className="font-medium text-sm">{field.value?.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  field.onChange(null);
                }}
                className="text-text-muted hover:text-foreground"
              >
                <Icon icon="LuX" size={14} />
              </button>
            </div>
            <span className="relative text-xs text-text-muted">
              {(field.value?.size / 1024).toFixed(1)} KB · click to replace
            </span>
          </>
        ) : (
          <>
            <span className={cn("relative transition-colors", isDragging ? "text-primary-500 font-semibold" : "text-sm font-medium")}>
              {isDragging
              ? "Drop your file here"
              : "Click or drag & drop a file to upload"}
            </span>
            <span className="relative text-xs text-text-muted">
              {item?.fileAccept?.join(", ") || "All files"} · up to {item?.maxFileSize || 1}MB
            </span>
          </>
        )}
        <input
          id="file"
          type="file"
          accept={item?.fileAccept?.join(",") ?? ""}
          className="hidden"
          onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
          readOnly={item?.isReadOnly || isReadOnly}
          disabled={item?.isDisabled || isDisabled}
        />
      </label>

      {item?.description
      ? <FieldDescription className="mt-0.5! text-xs text-dark-400">{item.description}</FieldDescription>
      : null}

      {formState.errors[item.name]
      ? <FieldError className="text-xs text-red-600">{`${(formState.errors[item.name] as any)?.message}`}</FieldError>
      : null}
    </Field>
  );
}

const TextCore = ({
  field,
  item,
  isDisabled,
  isReadOnly,
  schema,
  formState,
  trigger
}: T_InputDetail) => {
  return (
    <Field className={cn(spans(item?.colSpan?? 4), "gap-1")}>
      {item?.label
      ? <FieldLabel
          htmlFor={item?.name}
          className="font-semibold gap-1"
        >
          {item.label}
          {isFieldRequired(schema, item.name) && <span className="text-primary-500">*</span>}
        </FieldLabel>
      : null}

      <InputGroup className={cn("h-12 drop-shadow-sm")}>
        <InputGroupInput
          {...field}
          id={item.name}
          type={item?.type ?? "text"}
          className={cn("font-mono")}
          placeholder={item?.placeholder}
          onChange={(e) => {
            field.onChange(e);
            if (item.onChange) {
              item?.onChange(trigger);
            }
          }}
          readOnly={item?.isReadOnly || isReadOnly}
          disabled={item?.isDisabled || isDisabled}
        />
        {item.icon
        ? <InputGroupAddon className="w-fit! h-fit!" align="inline-end">
            <Icon
              icon={item.icon}
              className="text-dark-200"
              size={item.iconSize?? 20}
              onClick={item.iconOnClick}
            />
          </InputGroupAddon>
        : null}
      </InputGroup>

      {item?.type === "badge_input"
      ? <div className="flex mt-1 gap-1 flex-wrap">
          {field.value
          ? (field.value as string)?.split(",").map((bdg, idx) => (
              bdg.length ? <Badge key={`badge-${idx}`} variant="default">{bdg}</Badge> : null
            ))
          : null}
        </div>
      : null}

      {item?.description
      ? <FieldDescription className="mt-0.5! text-xs text-dark-400">{item.description}</FieldDescription>
      : null}

      {formState.errors[item.name]
      ? <FieldError className="text-xs text-red-600">{`${(formState.errors[item.name] as any)?.message}`}</FieldError>
      : null}
    </Field>
  );
}

const Inputs:T_Inputs = Object.assign({
  Checkbox: CheckboxCore,
  Select: SelectCore,
  File: FileCore,
  Text: TextCore,
  TextArea: TextAreaCore
});

export default Inputs;