import {Outlet} from "react-router-dom";
import {AppSidebar} from "@/components/app/Sidebar/AppSidebar.tsx";

export function LayoutWithSidebar() {
    return (
        <div style={{display: "flex"}}>
            <AppSidebar/>

            <div className="flex flex-1 px-4 py-12 sm:ml-64">
                <Outlet/>
            </div>
        </div>
    );
}