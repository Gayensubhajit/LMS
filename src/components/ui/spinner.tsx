import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-6 w-6",
        xl: "h-10 w-10",
      },
      variant: {
        default: "text-muted-foreground",
        primary: "text-primary",
        white: "text-white",
        blue: "text-blue-600 dark:text-blue-400",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({ size, variant, className, label, ...props }: SpinnerProps) {
  return (
    <div role="status" className={cn("flex flex-col items-center justify-center gap-2", className)} {...props}>
      <Loader2 className={cn(spinnerVariants({ size, variant }))} />
      {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}
