import { useState,      } from "react"
import Loader from "@/components/app/Loader/Loader"
import { ChannelSelector } from "./ChannelSelector"
import { TagSelector } from "./TagSelector"
import { useGetTrackedYoutubeChannelsQuery } from "@/hooks/data/local/analytics/useGetTrackedYoutubeChannelsQuery"
import { ErrorUI } from "@/components/app/Error/Error"
import { AddChannelDialog } from "./AddChannelDialog"
import { Statistics } from "./Statistics"
import { DateRangeSelector } from "./DateRangeSelector"

export default function YouTubeTracker() {
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    // date range in days
    const [selectedDateRange, setSelectedDateRange] = useState<number>(7)

    const { data: channels, isLoading: channelsLoading, error: channelsError } = useGetTrackedYoutubeChannelsQuery()


    const onTagSelect = (tag: string) => {
        setSelectedTag(tag)
        setSelectedChannel(null)
    }

    const onChannelSelect = (channel: string) => {
        setSelectedChannel(channel)
        setSelectedTag(null)
    }

    if (channelsLoading) {
        return <div className="flex justify-center items-center w-full h-screen">
            <Loader />
        </div>
    }

    if (channelsError) {
        return <ErrorUI error={channelsError} />
    }

    if (!channels) {
        return <h1 className="text-2xl font-bold">No data</h1>
    }

    const tags = Array.from(new Set(channels.map((channel) => channel.tag)))
    tags.unshift("All")


    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="text-3xl font-bold">YouTube Analytics Dashboard</h1>
            <nav className="flex items-center gap-4 justify-start w-full">
                <ChannelSelector channels={channels} onSelect={onChannelSelect} selectedChannel={selectedChannel} />
                <TagSelector tags={tags} onSelect={onTagSelect} selectedTag={selectedTag} />
                <DateRangeSelector dateRange={selectedDateRange} onSelect={setSelectedDateRange} />
                <div className="flex items-center gap-4 ml-auto">
                    <AddChannelDialog />
                </div>
            </nav>
            <div className="flex flex-col gap-4 w-full">
                {
                    selectedTag && selectedTag !== "All" && <Statistics dateRange={selectedDateRange} channels={channels.filter((channel) => channel.tag === selectedTag)} />
                }
                {selectedChannel && <Statistics dateRange={selectedDateRange} channels={channels.filter((channel) => channel.channel_id === selectedChannel)} />}
                {selectedTag === "All" && <Statistics dateRange={selectedDateRange} channels={channels} />}
            </div>
        </div>
    )
}

