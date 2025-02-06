"use client"

import { useMemo } from "react"
import { Line, LineChart, Bar, BarChart, Area, AreaChart, ResponsiveContainer, XAxis, YAxis, LabelList, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface YouTubeAnalytics {
    day: string
    views: number
    estimatedMinutesWatched: number
    subscribersGained: number
    likes: number
    dislikes: number
    averageViewDuration: number
    averageViewPercentage: number
}

type AnalyticsChartProps = {
    title: string
    data: YouTubeAnalytics[]
}

const formatData = (data: YouTubeAnalytics[], metric: keyof YouTubeAnalytics) => {
    return data.map((item) => ({
        day: new Date(item.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: item[metric],
    }))
}

const ChartCard = ({
    title,
    description,
    children,
}: { title: string; description: string; children: React.ReactNode }) => (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
)

export default function YouTubeAnalyticsDashboard({ data }: AnalyticsChartProps) {
    const viewsData = useMemo(() => formatData(data, "views"), [data])
    const watchTimeData = useMemo(() => formatData(data, "estimatedMinutesWatched"), [data])
    const subscribersData = useMemo(() => formatData(data, "subscribersGained"), [data])
    const likesData = useMemo(() => formatData(data, "likes"), [data])
    const dislikesData = useMemo(() => formatData(data, "dislikes"), [])
    const averageViewDurationData = useMemo(() => formatData(data, "averageViewDuration"), [])
    const averageViewPercentageData = useMemo(() => formatData(data, "averageViewPercentage"), [])

    console.log(data)


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Views" description="Daily view count">
                    <ChartContainer config={{ views: { label: "Views", color: "hsl(var(--chart-1))" } }} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={viewsData}>
                                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dataKey="value"
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="value" strokeWidth={2} dot={false} fillOpacity={0.2} fill="hsl(var(--chart-1))" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="Watch Time" description="Estimated minutes watched">
                    <ChartContainer
                        config={{ watchTime: { label: "Minutes", color: "hsl(var(--chart-3))" } }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={watchTimeData}>
                                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    strokeWidth={2}
                                    dot={false}
                                    fillOpacity={0.2}
                                    fill="hsl(var(--chart-1))"
                                    stroke="hsl(var(--chart-1))"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="New Subscribers" description="Daily new subscribers">
                    <ChartContainer
                        config={{ subscribers: { label: "Subscribers" } }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                accessibilityLayer
                                data={subscribersData}
                                margin={{
                                    top: 20,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="value" radius={8} fill="hsl(var(--chart-1))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="Likes vs Dislikes" description="Daily likes and dislikes">
                    <ChartContainer
                        config={{
                            likes: { label: "Likes", color: "hsl(var(--chart-4))" },
                            dislikes: { label: "Dislikes", color: "hsl(var(--chart-5))" },
                        }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart>
                                <XAxis dataKey="day"fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    data={likesData}
                                    dataKey="value"
                                    strokeWidth={2}
                                    dot={false}
                                    stroke="hsl(var(--chart-2))"
                                />
                                <Line
                                    type="monotone"
                                    data={dislikesData}
                                    stroke="hsl(var(--chart-5))"
                                    dataKey="value"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="Average View Duration" description="Average view duration">
                    <ChartContainer
                        config={{ averageViewDuration: { label: "Duration", color: "hsl(var(--chart-6))" } }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={averageViewDurationData}>
                                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString()} sec.`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="value" strokeWidth={2} dot={false} fillOpacity={0.2} fill="hsl(var(--chart-6))" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>

                <ChartCard title="Average View Percentage" description="Average view percentage">
                    <ChartContainer
                        config={{ averageViewPercentage: { label: "Percentage", color: "hsl(var(--chart-2))" } }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={averageViewPercentageData}>
                                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString()}%`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="value" strokeWidth={2} dot={false} fillOpacity={0.2} fill="hsl(var(--chart-4))" stroke="hsl(var(--chart-4))" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </ChartCard>
            </div>
        </div>
    )
}

