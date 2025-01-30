import {useEffect, useState} from "react"
import {motion} from "framer-motion"
import {formatDistanceToNow} from "date-fns"
import {AlertCircle, Check} from "lucide-react"
import {
    type GetProjectTasksResponseItem,
    useGetProjectTasksQuery
} from "@/hooks/data/local/projects/useGetProjectTasksQuery.ts";
import Loader from "@/components/app/Loader/Loader.tsx";
import {atUTC} from "@/lib/utils.ts";

interface LastTaskPanelProps {
    projectId: string
}

export function LastTaskPanel({projectId}: LastTaskPanelProps) {
    const {data: tasks, isLoading, isError} = useGetProjectTasksQuery(projectId)
    const [lastTask, setLastTask] = useState<GetProjectTasksResponseItem | null>(null)

    useEffect(() => {
        if (tasks && tasks.length > 0) {
            // sort tasks by created_at in descending order
            tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            setLastTask(tasks[0])
        }
    }, [tasks])

    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <div className="bg-red-900 text-white rounded-lg p-6 shadow-lg">Error loading tasks</div>
    }

    if (!lastTask) {
        return null
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "started":
                return "bg-blue-600"
            case "completed":
                return "bg-green-600"
            case "failed":
                return "bg-red-600"
            default:
                return "bg-gray-600"
        }
    }

    return (
        <div className="bg-secondary rounded-lg p-6 shadow-lg">
            <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(lastTask.status)}`}/>
                <span className="text-lg font-semibold">{lastTask.tool_name}</span>
            </div>
            <div className="mb-4">
                <p className="text-sm text-gray-400">Started {formatDistanceToNow(new Date(atUTC(lastTask.created_at)))} ago</p>
            </div>
            {lastTask.status === "started" && (
                <motion.div
                    className="h-2 bg-blue-900 rounded-full overflow-hidden"
                    initial={{width: 0}}
                    animate={{width: "100%"}}
                    transition={{duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
                >
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{x: "-100%"}}
                        animate={{x: "100%"}}
                        transition={{duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
                    />
                </motion.div>
            )}
            {lastTask.status === "failed" && (
                <div className="flex items-center text-red-500">
                    <AlertCircle className="mr-2"/>
                    <span>Error: {lastTask.error_message}</span>
                </div>
            )}
            {lastTask.status === "completed" && (
                <div className="flex items-center text-green-500">
                    <Check className="mr-2"/>
                    <span>Your edit is ready</span>
                </div>
            )}
        </div>
    )
}

