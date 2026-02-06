import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  totalLabel?: string;
  totalCount?: number;
  loading?: boolean;
  children?: ReactNode; // For action buttons
}

export const PageHeader = ({ 
  title, 
  totalLabel = "Total", 
  totalCount = 0, 
  loading = false,
  children 
}: PageHeaderProps) => {
  return (
    <div className="flex justify-between gap-2 mb-4 items-left">
      <div className="flex flex-col">
        <Label className="text-2xl font-semibold">{title}</Label>
        {!loading && (
          <Label className="text-xs font-semibold">
            {`${totalLabel} - ${totalCount}`}
          </Label>
        )}
      </div>
      
      <div className="flex flex-row gap-2">
        {children}
      </div> 
    </div>
  );
};
