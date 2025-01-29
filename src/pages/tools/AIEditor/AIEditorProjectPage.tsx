import {TopBar} from "@/pages/tools/AIEditor/TopBar.tsx";
import {useParams} from "react-router-dom";
import FileExplorer from "@/components/app/FileExplorer/FileExplorer.tsx";
import {Toolbar} from "@/pages/tools/AIEditor/Toolbar.tsx";
import {LastTaskPanel} from "@/pages/tools/AIEditor/LastTaskPanel.tsx";

export default function AIEditorProjectPage() {
    const {project_id} = useParams()

    return (
        <div className="flex flex-col w-full justify-between px-4 gap-4">
            <TopBar/>
            <LastTaskPanel projectId={project_id!}/>
            <section className="flex justify-between w-full max-w-4xl gap-4">
                <FileExplorer project_id={project_id!}/>
                <Toolbar />
            </section>
        </div>
    )
}