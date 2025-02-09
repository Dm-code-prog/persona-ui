import { Button } from "@/components/ui/button"
import { useAggregateAnalytics } from "@/hooks/data/local/analytics/useYouTubeChannelAnalytics"
import YouTubeAnalyticsChart from "./AnalyticsChart"
import Loader from "@/components/app/Loader/Loader"
import { ErrorUI } from "@/components/app/Error/Error"
import { useInitiateYoutubeAuthMutation } from "@/hooks/data/local/analytics/useInitiateYoutubeAuthMutation"

type StatisticsProps = {
    channels: { channel_id: string, channel_name: string }[]
    dateRange: number
}

export const Statistics = ({ channels, dateRange }: StatisticsProps) => {
    const { data, isLoading, error } = useAggregateAnalytics({ channels, dateRange })

    const authMutation = useInitiateYoutubeAuthMutation()

    if (isLoading) {
        return <Loader />
    }

    if (error?.message?.includes("Unauthorized")) {
        const channelID = error.message.split("=")[1]
        return (<section className="flex flex-col gap-4 p-4">
            <h3 className="text-lg font-bold">Unauthorized</h3>
            <Button className="w-32 bg-blue-500 text-white hover:bg-blue-600" onClick={() => authMutation.mutate({ channel_id: channelID })}>Authorize</Button>
        </section>)
    }

    if (error) {
        return <ErrorUI error={error} />
    }


    return (
        <div>
            <YouTubeAnalyticsChart title="Views" data={data || []} />
        </div>
    )
}
