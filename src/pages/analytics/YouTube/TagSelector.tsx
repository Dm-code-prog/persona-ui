import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TagSelectorProps {
    tags: string[]
    selectedTag: string | null
    onSelect: (tag: string) => void
}

export function TagSelector({ tags, selectedTag, onSelect }: TagSelectorProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {selectedTag || "Select tag..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search tag..." />
                    <CommandList>
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                            {tags.map((tag) => (
                                <CommandItem
                                    key={tag}
                                    onSelect={() => {
                                        setOpen(false)
                                        onSelect(tag)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", selectedTag === tag ? "opacity-100" : "opacity-0")} />
                                    {tag}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

