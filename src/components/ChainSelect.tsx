import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CHAINS } from "@/lib/chains";

type ChainSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const ChainSelect = ({ value, onValueChange, placeholder = "Select chain", className }: ChainSelectProps) => {
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => CHAINS.find((c) => c.value === value) || null, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          {selected ? (
            <div className="flex items-center gap-2">
              {selected.icon ? (
                <img src={selected.icon} className="h-5 w-5 rounded-full" alt="" />
              ) : (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                  {selected.label.slice(0, 1)}
                </div>
              )}
              <span className="truncate">{selected.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search chain..." />
          <CommandList>
            <CommandEmpty>No chains found.</CommandEmpty>
            <CommandGroup>
              {CHAINS.map((c) => {
                const isSelected = c.value === value;
                return (
                  <CommandItem
                    key={c.value}
                    value={`${c.label} ${c.value}`}
                    onSelect={() => {
                      onValueChange(c.value);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {c.icon ? (
                        <img src={c.icon} className="h-5 w-5 rounded-full" alt="" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                          {c.label.slice(0, 1)}
                        </div>
                      )}
                      <span className="truncate">{c.label}</span>
                      {isSelected ? <Check className="ml-auto h-4 w-4" /> : null}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ChainSelect;
