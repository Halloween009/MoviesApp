import { CustomInputProps } from "@/types";

// Базовый компонент
const CustomInput = (props: CustomInputProps) => (
  <input
    className="h-12 bg-gray-200 rounded-3xl p-2 m-3"
    type="text"
    {...props}
  />
);

export default CustomInput;

// Пример расширения без изменения CustomInput:
// Можно создать новый компонент, который добавляет функциональность
export const ValidatedInput = (
  props: CustomInputProps & { validate?: (v: string) => boolean },
) => {
  const { validate, value, ...rest } = props;
  const isValid = validate ? validate(String(value)) : true;
  return (
    <CustomInput
      {...rest}
      value={value}
      style={{ borderColor: isValid ? "#22c55e" : "#ef4444", borderWidth: 2 }}
    />
  );
};
