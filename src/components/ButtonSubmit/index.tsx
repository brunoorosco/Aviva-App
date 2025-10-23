import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export interface IButtonSubmit {
  value?: string;
  type: "submit" | "reset";
  onClick?: (event: string) => void;
  disabled?: boolean;
  text: string;
  loading?: boolean;
}
const ButtonSubmit: React.FC<IButtonSubmit> = ({
  type,
  disabled = false,
  text,
  loading,
}) => {
  return (
    <Button
      type={type}
      disabled={disabled || loading}
      className="w-full bg-lime-500 hover:bg-lime-400 text-white font-semibold text-base py-3 rounded-md shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Conectando...</span>
        </div>
      ) : (
        text
      )}
    </Button>
  );
};

export default ButtonSubmit;
