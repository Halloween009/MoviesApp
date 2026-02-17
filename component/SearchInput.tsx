import CustomInput from "./CustomInput";
import { SearchInputProps } from "@/types";

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      <CustomInput
        name="search"
        value={value}
        placeholder="Search movie..."
        onChange={handleInputChange}
      />
    </>
  );
};
