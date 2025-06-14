import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ComboboxOption = {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  popoverClassName?: string
  icon?: React.ReactNode
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opción",
  emptyMessage = "No se encontraron resultados",
  className,
  popoverClassName,
  icon,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span className="truncate">
              {value && selectedOption
                ? selectedOption.label
                : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn("w-[var(--radix-popover-trigger-width)] p-0", popoverClassName)} 
        align="start"
        sideOffset={5}
      >
        <div className="max-h-[300px] overflow-auto py-1">
          {options.length > 0 ? (
            <div>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    value === option.value ? "bg-accent/50" : ""
                  )}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <span className="w-5 flex-shrink-0">
                    {value === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </span>
                  {option.label}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 