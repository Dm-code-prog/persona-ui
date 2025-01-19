import {PipelinesList} from "@/pages/pipelines/Top5PipelinesList/pipelines-list.tsx";
import {CreatePipelineDialog} from "@/pages/pipelines/Top5PipelinesList/create-pipeline-dialog.tsx";

export default function Top5PipelinesList() {
    return (
        <main className="flex flex-col gap-8 p-4 items-center justify-between w-full h-full">
            <section className="flex items-center justify-between w-full">
                <h3 className="text-2xl font-bold">
                    Top 5 Pipelines
                </h3>
                <CreatePipelineDialog/>
            </section>
            <section className="w-full mb-auto">
                <PipelinesList/>
            </section>
        </main>
    );
}

