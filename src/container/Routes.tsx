import {Routes, Route} from "react-router-dom";
import HomePage from "@/pages/Home/HomePage";
import SecretsPage from "@/pages/Secrets/SecretsPage";
import AIEditorPage from "@/pages/tools/AIEditor/AIEditorPage.tsx";
import AIEditorProjectPage from "@/pages/tools/AIEditor/AIEditorProjectPage.tsx";
import YouTubeTracker from "@/pages/analytics/YouTube/YouTube.tsx";

import {LayoutWithSidebar} from "@/components/app/Sidebar/Layout.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LayoutWithSidebar/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/secrets" element={<SecretsPage/>}/>
                <Route path="/tools/ai-editor" element={<AIEditorPage/>}/>
                <Route path="/tools/ai-editor/:project_id" element={<AIEditorProjectPage/>}/>
                <Route path="/analytics/youtube-channels" element={<YouTubeTracker/>}/>
                <Route path="*" element={
                    <div className="flex w-full items-center justify-center text-2xl font-bold">404 | Not Found</div>
                }/>
            </Route>
        </Routes>
    );
}
