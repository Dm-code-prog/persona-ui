import { Button } from "@/components/ui/button"
import { useYouTubeAnalytics } from "@/hooks/data/local/analytics/useYouTubeChannelAnalytics"
import YouTubeAnalyticsChart from "./AnalyticsChart"

type StatisticsProps = {
    channels: { channel_id: string, channel_name: string }[]
    dateRange: number
}

export const Statistics = ({ channels, dateRange }: StatisticsProps) => {

    const from = new Date()
    from.setDate(from.getDate() - dateRange)
    const to = new Date()

    const r = useYouTubeAnalytics(channels[0].channel_id, from.toISOString().split("T")[0], to.toISOString().split("T")[0])

    if (!r.isAuthorized) {
        return (
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">Please authorize to view analytics</h3>
                <Button variant="outline" className="w-32" onClick={r.initiateOAuth}>Authorize</Button>
            </div>
        )
    }

    return (
        <div>
            <YouTubeAnalyticsChart title="Views" data={r.analyticsData || []} />
        </div>
    )
}