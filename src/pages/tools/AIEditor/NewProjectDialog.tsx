import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
    name: z.string().min(1, "Project name is required").max(50, "Project name must be 50 characters or less"),
})

type FormData = z.infer<typeof formSchema>

interface NewProjectDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreateProject: (projectName: string) => void
}

export function NewProjectDialog({ isOpen, onClose, onCreateProject }: NewProjectDialogProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = (data: FormData) => {
        onCreateProject(data.name)
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-background">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter project name"
                                            {...field}
                                            className="bg-background "
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Create Project
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

