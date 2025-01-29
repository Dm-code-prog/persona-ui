'use client'

import {formatDistanceToNow} from 'date-fns'
import {Link} from "react-router-dom";
import {ErrorUI} from "@/components/app/Error/Error.tsx";
import Loader from "@/components/app/Loader/Loader.tsx";
import {useListTop5PipelinesQuery} from "@/hooks/data/local/old/useListTop5PipelinesQuery.ts";

export function PipelinesList() {
    const {data, error, isPending} = useListTop5PipelinesQuery()

    if (error) {
        return <ErrorUI error={error}/>
    }

    if (isPending) {
        return <Loader/>
    }

    const pipelines = data?.sort((a, b) => {
        return a.created_at > b.created_at ? -1 : 1
    }) || []

    return (
        <ul className="space-y-4">
            {pipelines.map((pipeline) => (
                <Link to={`/pipelines/top-5/${pipeline.id}`} key={pipeline.id}
                      className="bg-secondary border rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <span
                            className="text-lg font-semibold hover:underline">
                            {pipeline.name || 'Untitled pipeline'}
                        </span>
                        <p className="text-sm text-gray-500">
                            Created {formatDistanceToNow(
                            pipeline.created_at.endsWith('Z') ? new Date(pipeline.created_at) :
                                new Date(pipeline.created_at + 'Z')
                        )} ago
                        </p>
                    </div>
                    <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                pipeline.status === 'completed' ? 'bg-green-100 text-green-800' :
                    pipeline.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                        pipeline.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
            }`}>
              {pipeline.status.replace('_', ' ')}
            </span>
                    </div>
                </Link>
            ))}
        </ul>
    )
}

