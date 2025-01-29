import {useState} from "react"
import {Plus, ChevronDown} from "lucide-react"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {useGetProjectsQuery} from "@/hooks/data/local/projects/useGetProjectsQuery.ts";
import {ErrorUI} from "@/components/app/Error/Error.tsx";
import {NewProjectDialog} from "@/pages/tools/AIEditor/NewProjectDialog.tsx";
import {useCreateNewProjectMutation} from "@/hooks/data/local/projects/useCreateNewProjectMutation.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {useNavigate} from "react-router-dom";


export function TopBar() {
    const {data, error, isPending} = useGetProjectsQuery();
    const navigate = useNavigate()

    const [selectedProject, setSelectedProject] = useState<string | null>(
        null
    )

    const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false)


    const mutation = useCreateNewProjectMutation()
    const {toast} = useToast()

    const handleNewProject = () => {
        setIsNewProjectDialogOpen(true)
    }

    const handleCreateProject = (projectName: string) => {
        mutation.mutate({
            name: projectName
        }, {
            onSuccess: (response) => {
                toast({
                    title: "Project created successfully",
                })
                setSelectedProject(response.name)

                navigate(`/tools/ai-editor/${response.id}`)
            }
        })
    }

    if (isPending) return null;

    if (error) {
        return <ErrorUI error={error}/>
    }

    return (
        <div className="flex items-center justify-between bg-background w-full">
            <div className="flex w-full items-center justify-between space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-secondary  border-2 border-accent">
                            {selectedProject || "Select Project"} <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-secondary border-gray-700">
                        {data.map((project) => (
                            <DropdownMenuItem
                                key={project.id}
                                onClick={() => {
                                    setSelectedProject(project.name)
                                    navigate(`/tools/ai-editor/${project.id}`)
                                }}
                                className="text-gray-300 focus:bg-gray-700 focus:text-white"
                            >
                                {project.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    onClick={handleNewProject}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    <Plus className="mr-2 h-4 w-4"/> New
                </Button>

                <NewProjectDialog
                    isOpen={isNewProjectDialogOpen}
                    onClose={() => setIsNewProjectDialogOpen(false)}
                    onCreateProject={handleCreateProject}
                />
            </div>
        </div>
    )
}

