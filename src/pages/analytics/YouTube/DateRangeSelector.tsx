import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangeSelectorProps {
    dateRange: number
    onSelect: (dateRange: number) => void
}

export function DateRangeSelector({ dateRange, onSelect }: DateRangeSelectorProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(dateRange)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {`${dateRange} days`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search tag..." />
                    <CommandList>
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                            {[7, 30, 90, 180, 365].map((dateRange) => (
                                <CommandItem
                                    key={dateRange}
                                    onSelect={() => {
                                        setValue(dateRange)
                                        setOpen(false)
                                        onSelect(dateRange)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === dateRange ? "opacity-100" : "opacity-0")} />
                                    {dateRange === 1 ? "1 day" : `${dateRange} days`}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

