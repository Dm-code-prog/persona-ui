import {Routes, Route} from "react-router-dom";
import HomePage from "@/pages/Home/HomePage";
import SecretsPage from "@/pages/Secrets/SecretsPage";
import {LayoutWithSidebar} from "@/components/app/Sidebar/Layout.tsx";
import Top5PipelinesList from "@/pages/pipelines/Top5PipelinesList/Top5PipelinesList.tsx";
import LongToShorts from "@/pages/tools/LongToShorts/LongToShorts.tsx";
import Top5Pipeline from "@/pages/pipelines/Top5PipelinesList/Top5Pipeline/Top5Pipeline.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LayoutWithSidebar/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/secrets" element={<SecretsPage/>}/>
                <Route path="/pipelines/top-5" element={<Top5PipelinesList/>}/>
                <Route path="/pipelines/top-5/:id" element={<Top5Pipeline/>}/>

                <Route path="/tools/long-to-shorts" element={<LongToShorts/>}/>

                <Route path="*" element={
                    <div className="flex w-full items-center justify-center text-2xl font-bold">404 | Not Found</div>
                }/>
            </Route>
        </Routes>
    );
}
