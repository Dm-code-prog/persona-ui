import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Loader from "@/components/app/Loader/Loader"
import { ChannelSelector } from "./ChannelSelector"
import { TagSelector } from "./TagSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useYouTubeAnalytics } from "@/hooks/data/local/analytics/useYouTubeChannelAnalytics"
import { useGetTrackedYoutubeChannelsQuery } from "@/hooks/data/local/analytics/useGetTrackedYoutubeChannelsQuery"
import { ErrorUI } from "@/components/app/Error/Error"
import { useCreateTrackedYoutubeChannelMutation } from "@/hooks/data/local/analytics/useCreateTrackedYoutubeChannelMutation"
import { useToast } from "@/hooks/use-toast"
import { AddChannelDialog } from "./AddChannelDialog"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Statistics } from "./Statistics"
import { DateRangeSelector } from "./DateRangeSelector"

export default function YouTubeTracker() {
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    // date range in days
    const [selectedDateRange, setSelectedDateRange] = useState<number>(7)

    const { data: channels, isLoading: channelsLoading, error: channelsError } = useGetTrackedYoutubeChannelsQuery()

    if (channelsLoading) {
        return <Loader />
    }

    if (channelsError) {
        return <ErrorUI error={channelsError} />
    }

    if (!channels) {
        return <h1 className="text-2xl font-bold">No data</h1>
    }

    const tags = Array.from(new Set(channels.map((channel) => channel.tag)))


    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="text-3xl font-bold">YouTube Analytics Dashboard</h1>
            <nav className="flex items-center gap-4 justify-start w-full">
                <ChannelSelector channels={channels} onSelect={setSelectedChannel} />
                <TagSelector tags={tags} onSelect={setSelectedTag} />
                <DateRangeSelector dateRange={selectedDateRange} onSelect={setSelectedDateRange} />
                <div className="flex items-center gap-4 ml-auto">
                    <AddChannelDialog />
                </div>
            </nav>
            <div className="flex flex-col gap-4 w-full">
                {selectedChannel && <Statistics dateRange={selectedDateRange} channels={channels.filter((channel) => channel.channel_id === selectedChannel)} />}
            </div>
        </div>
    )
}

