import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useListProjectFilesQuery} from "@/hooks/data/local/projects/useListProjectFilesQuery.ts";
import {useParams} from "react-router-dom";
import {ErrorUI} from "@/components/app/Error/Error.tsx";
import Loader from "@/components/app/Loader/Loader.tsx";
import {useRunPauseCutterToolMutation} from "@/hooks/data/local/tools/useRunPauseCutterToolMutation.ts";
import {useToast} from "@/hooks/use-toast"

const formSchema = z.object({
    pause_threshold: z.number().min(0.1).max(10).optional().default(0.5),
    pause_padding: z.number().min(0.05).max(10).optional().default(0.1),
    whisper_model: z.string().optional().default("small"),
    video_name: z.string(),
    output_name: z.string().optional().default("pause-cutter-output.mp4"),
})

type FormData = z.infer<typeof formSchema>

interface PauseCutterFormProps {
    onClose: () => void
}

export function PauseCutterForm({onClose}: PauseCutterFormProps) {
    const {project_id} = useParams();
    const {data: files, error, isPending} = useListProjectFilesQuery(project_id!)

    const mutation = useRunPauseCutterToolMutation(project_id!)

    const {toast} = useToast()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pause_threshold: 0.5,
            pause_padding: 0.1,
            whisper_model: "small",
            output_name: "pause-cutter-output.mp4",
        },
    })

    const onSubmit = (data: FormData) => {
        mutation.mutate({
                project_id: project_id!,
                ...data,
            }, {
                onSuccess: () => {
                    toast({
                        title: "Pause Cutter Tool",
                        description: "The tool started processing the video",
                    })
                    onClose()
                },
                onError: (error) => {
                    toast({
                        title: "Pause Cutter Tool",
                        description: error.message,
                    })
                }
            }
        )
    }

    if (error) {
        return <ErrorUI error={error}/>
    }

    if (isPending) {
        return <Loader/>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="video_name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Select File</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className=" text-white">
                                        <SelectValue placeholder="Select a file"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-gray-600 text-white">
                                    {files?.['input']?.['videos']?.map((file: string) => (
                                        <SelectItem key={file} value={file}>
                                            {file}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="output_name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Output Name</FormLabel>
                            <Input
                                {...field}
                                className="text-white"
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                

                <section className="flex space-x-4">
                    <FormField
                        control={form.control}
                        name="pause_threshold"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Pause threshold (seconds)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        {...field}
                                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                        className=" text-white"
                                    />
                                </FormControl>
                                <FormDescription>
                                    The minimum duration of a pause to be considered for cutting (0.1 to 10
                                    seconds).
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pause_padding"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Pause threshold (seconds)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                        className="text-white"
                                    />
                                </FormControl>
                                <FormDescription>
                                    The padding duration to be added before and after the pause (0.05 to 10
                                    seconds).
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </section>

                <FormField
                    control={form.control}
                    name="whisper_model"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Select the model size for Speech-To-Text</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue="medium">
                                <FormControl>
                                    <SelectTrigger className="  text-white">
                                        <SelectValue placeholder="Select a file"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className=" border-gray-600 text-white">
                                    <SelectItem value="small">Small (2 GB GPU memory)</SelectItem>
                                    <SelectItem value="medium">Medium (5 GB GPU memory)</SelectItem>
                                    <SelectItem value="large">Large (10 GB GPU memory)</SelectItem>
                                    <SelectItem value="turbo">Turbo (6 GB GPU memory)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="bg-secondary text-white hover:bg-gray-600"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                        Run
                    </Button>
                </div>
            </form>
        </Form>
    )
}

