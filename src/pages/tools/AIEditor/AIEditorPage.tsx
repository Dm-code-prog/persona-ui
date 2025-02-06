import {TopBar} from "@/pages/tools/AIEditor/TopBar.tsx";
import NoProjectSelected from "./NoProjectSelected";

export default function AIEditorPage() {
    return (
        <div className="flex w-full flex-col px-4">
            <TopBar />
            <NoProjectSelected />
        </div>
    )
}