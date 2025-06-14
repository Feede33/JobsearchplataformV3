import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Seleccionar opciones",
  className
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Cerrar el dropdown cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  return (
    <div className="relative w-full" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn(
          "w-full justify-between text-left font-normal",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 items-center truncate">
          {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
          {selected.length > 0 && (
            selected.length <= 2 ? (
              <span className="truncate">{selectedLabels.join(", ")}</span>
            ) : (
              <span>{selected.length} seleccionados</span>
            )
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 w-full bg-popover rounded-md border mt-1 shadow-md max-h-60 overflow-auto">
          <div className="p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    isSelected ? "bg-accent/50" : ""
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border mr-2",
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 