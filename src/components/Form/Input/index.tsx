import { cn } from "../../../utils/helpers";

const Input = ({ className, ...props }: any) => {
  return (
    <input
      className={cn(
        `border w-full px-3 py-1.5 rounded-md foxus:ring-1 ring-primary outline-primary`,
        className
      )}
      {...props}
    />
  );
};

export default Input;
