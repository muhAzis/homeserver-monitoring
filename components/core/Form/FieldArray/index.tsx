import {
  Control,
  Controller,
  ControllerRenderProps,
  FormState,
  UseFormRegister,
  UseFormTrigger,
  UseFormWatch,
  useFieldArray
} from "react-hook-form";
import { T_Field } from "..";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Inputs, { isFieldRequired } from "../Inputs";
import { Button } from "@/components/ui/button";
import Icon from "../../Icon";

type T_FieldArray = {
  field: T_Field;
  control: Control;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;

  schema: any;
  formState: FormState<any>;
  trigger: UseFormTrigger<any>;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

const FieldArray = ({
  field,
  control,
  register,
  watch,
  schema,
  formState,
  trigger,
  isDisabled,
  isReadOnly
}: T_FieldArray) => {
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: field.name
  });

  const handleAppend = () => {
    if (field.subFields) {
      const emptyObject = field.subFields(watch).reduce((acc: Record<string, any>, subField: T_Field) => {
        acc[subField.name] = "";
        return acc;
      }, {});
      append(emptyObject);
    } else {
      append(""); 
    }
  };

  const handleRemove = (idx: number) => {
    remove(idx);
  }

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
  
  return (
    <div className="flex flex-col col-span-4 mt-2 gap-2">
      <div className="flex gap-4 items-center justify-between">
        <FieldLabel
          htmlFor={field?.name}
          className={cn("font-semibold gap-1", !field.label && "capitalize")}
        >
          {field.label ?? field.name.replaceAll("_", " ")}
          {isFieldRequired(schema, field.name) && <span className="text-primary-500">*</span>}
        </FieldLabel>

        <Button type="button" onClick={handleAppend}>
          <Icon icon="LuPlus"/>
          Add
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        {fields.length > 0
        ? fields.map((item, idx) => (
            <div key={`field-${item.id}-${idx}-of-${field?.name}`} className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <div className="grid grid-cols-4 flex-1 gap-x-4 gap-y-2">
                  {field.subFields
                  ? field.subFields(watch)?.map((subItem) => (
                    <Controller
                      key={`field-${subItem?.name}-${idx}-of-${field?.name}`}
                      control={control}
                      name={`${field.name}.${idx}.${subItem.name}` as string}
                      render={({ field }) => renderInput(field, subItem)}
                    />
                  ))
                  : null}
                </div>
                {fields.length > 0
                ? <Icon icon="LuX" onClick={() => handleRemove(idx)} />
                : null}
              </div>

              {formState.errors[field.name] && (formState.errors[field.name] as any).length
              ? (formState.errors[field.name] as any)[idx]
                ? <div>
                    {(Object.entries((formState.errors[field.name] as any)[idx])).map(([key, val]) => (
                      <div key={`error-${key}-${idx}`} className="flex gap-2 items-center">
                        <div className="h-1 w-1 bg-primary-500 rounded-full"></div>
                        <FieldError className="text-xs text-red-600">{`${(val as any)?.message}`}</FieldError>
                      </div>
                    ))}
                  </div>
                : null
              : null}
            </div>))
          : <div className="w-full text-center text-text-muted/50">
              No "<span className="font-semibold">{field?.label ?? field.name.replaceAll("_", " ")}</span>" items yet
            </div>}
      </div>
    </div>
  );
}

export default FieldArray