import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Channel {
    channel_id: string
    channel_name: string
}

interface ChannelSelectorProps {
    channels: Channel[]
    selectedChannel: string | null
    onSelect: (channelId: string) => void
}

export function ChannelSelector({ channels, selectedChannel, onSelect }: ChannelSelectorProps) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (channels && channels.length > 0) {
            onSelect(channels[0].channel_id)
        }
    }, [channels])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {selectedChannel ? channels.find((channel) => channel.channel_id === selectedChannel)?.channel_name : "Select channel..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search channel..." />
                    <CommandList>
                        <CommandEmpty>No channel found.</CommandEmpty>
                        <CommandGroup>
                            {channels.map((channel) => (
                                <CommandItem
                                    key={channel.channel_id}
                                    onSelect={() => {
                                        setOpen(false)
                                        onSelect(channel.channel_id)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", selectedChannel === channel.channel_id ? "opacity-100" : "opacity-0")} />
                                    {channel.channel_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

