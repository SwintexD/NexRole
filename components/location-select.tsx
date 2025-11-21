"use client";

import { Check, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

// List of major locations
const locations = [
  { value: "sri_lanka", label: "Sri Lanka" },
  { value: "germany", label: "Germany" },
  { value: "usa", label: "USA" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "france", label: "France" },
  { value: "australia", label: "Australia" },
  { value: "india", label: "India" },
  { value: "japan", label: "Japan" },
  { value: "singapore", label: "Singapore" },
];

export function LocationSelect({ value, onChange }: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between hover:border-primary/50 transition-colors"
            disabled={remoteOnly}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {value
                ? locations.find((location) => location.value === value)
                    ?.label
                : "Select location..."}
            </div>
            <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[280px] overflow-hidden" align="start">
          <Command>
            <CommandInput placeholder="Search location..." className="h-9" />
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup className="max-h-[220px] overflow-y-auto">
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="pl-6 transition-colors hover:bg-primary/10 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 transition-transform",
                      value === location.value
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    )}
                  />
                  {location.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex items-center space-x-2">
        <Switch
          id="remote"
          checked={remoteOnly}
          onCheckedChange={(checked) => {
            setRemoteOnly(checked);
            if (checked) {
              onChange("");
            }
          }}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="remote" className="cursor-pointer text-sm">
          Remote only
        </Label>
      </div>
    </div>
  );
}
