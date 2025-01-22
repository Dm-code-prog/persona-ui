import {Top5PipelineForm} from "@/pages/pipelines/Top5PipelinesList/Top5Pipeline/Form.tsx";
import Top5FileExplorerUploader from "@/pages/pipelines/Top5PipelinesList/Top5Pipeline/FileExplorer.tsx";
import {useParams} from "react-router-dom";

export default function Top5Pipeline() {
    const {id} = useParams()
    return (
        <main className="flex flex-col gap-8 p-4 items-center justify-between w-full h-full">
            <section className="flex items-center justify-between w-full">
                <h3 className="text-2xl font-bold">
                    Top 5 Pipeline
                </h3>
            </section>
            <div className="flex flex-col xl:flex-row flex-grow gap-8 w-full mb-auto">
                <Top5FileExplorerUploader pipelineId={id!}/>
                <Top5PipelineForm/>
            </div>
        </main>
    );
}

