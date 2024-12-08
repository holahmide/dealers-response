import { cn } from "../../../utils/helpers";

const Label = ({
  className,
  label,
  required,
}: {
  className?: string;
  label: string;
  required?: boolean;
}) => {
  return (
    <label
      className={cn("block text-sm font-medium text-gray-700 mb-2", className)}
    >
      <span>{label}</span> {required && <span className="text-red-400">*</span>}
    </label>
  );
};

export default Label;
