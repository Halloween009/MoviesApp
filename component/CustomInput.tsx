import { CustomInputProps } from "@/types";

const CustomInput = ({
  name,
  value,
  placeholder,
  onChange,
}: CustomInputProps) => (
  <input
    className="h-12  bg-gray-200 rounded-3xl p-2 m-3"
    name={name}
    value={value}
    type="text"
    placeholder={placeholder}
    onChange={onChange}
  />
);

export default CustomInput;
