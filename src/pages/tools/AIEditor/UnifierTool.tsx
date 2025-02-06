import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRunUnifierToolMutation } from "@/hooks/data/local/tools/useRunUnifierMutation"
import { useParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { ErrorUI } from "@/components/app/Error/Error"
import Loader from "@/components/app/Loader/Loader"
import { useListProjectFilesQuery } from "@/hooks/data/local/projects/useListProjectFilesQuery"
import { Form, FormMessage, FormControl, FormItem, FormLabel, FormField, FormDescription } from "@/components/ui/form"
import { Select } from "@/components/ui/select"
import { SelectItem, SelectValue } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
interface UnifierToolFormProps {
    onClose: () => void
}

const formSchema = z.object({
    video_name: z.string(),
    effect_name: z.string(),
    output_name: z.string(),
    blend_mode: z.string(),
    opacity: z.number(),
})

type FormData = z.infer<typeof formSchema>

export const UnifierToolForm = ({ onClose }: UnifierToolFormProps) => {
    const { project_id } = useParams();

    const { data: files, error, isPending } = useListProjectFilesQuery(project_id!)

    const {toast} = useToast() 
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            output_name: "unifier-output.mp4",
            blend_mode: "lighten",
            opacity: 0.2,
        }
    })

    const mutation = useRunUnifierToolMutation(project_id!)

    const onSubmit = (data: FormData) => {
        mutation.mutate({
            ...data,
        }, {
            onSuccess: () => {
                toast({
                    title: "Unifier Tool",
                    description: "The tool started processing the video",
                })
            },
            onError: (error) => {
                toast({
                    title: "Unifier Tool",
                    description: error.message,
                })
            }
        })

        form.reset()
        onClose()
    }

    if (error) {
        return <ErrorUI error={error} />
    }

    if (isPending) {
        return <Loader />
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="video_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select File</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className=" text-white">
                                        <SelectValue placeholder="Select a file" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-secondary border-gray-600 text-white">
                                    {files?.['input']?.['videos']?.map((file: string) => (
                                        <SelectItem key={file} value={file}>
                                            {file}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.getValues('video_name') && (
                                <FormDescription>
                                    {files?.['input']?.['videos']?.find((video: string) => video === form.getValues('video_name'))}
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="effect_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Effect</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className=" text-white">
                                        <SelectValue placeholder="Select an effect" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className=" border-gray-600 text-white">
                                    {files?.['input']?.['video_effects']?.map((effect: string) => (
                                        <SelectItem key={effect} value={effect}>
                                            {effect}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.getValues('effect_name') && (
                                <FormDescription>
                                    {files?.['input']?.['video_effects']?.find((effect: string) => effect === form.getValues('effect_name'))}
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <h3 className="text-md font-bold text-muted">
                    Advanced settings:
                </h3>

                <FormField
                    control={form.control}
                    name="output_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Output Name</FormLabel>
                            <Input
                                {...field}
                                className="text-white"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">

                <FormField
                    control={form.control}
                    name="blend_mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Blend Mode</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="text-white">
                                        <SelectValue placeholder="Select a blend mode" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-gray-600 text-white">
                                    <SelectItem value="addition">Addition</SelectItem>
                                    <SelectItem value="and">And</SelectItem>
                                    <SelectItem value="average">Average</SelectItem>
                                    <SelectItem value="bleach">Bleach</SelectItem>
                                    <SelectItem value="burn">Burn</SelectItem>
                                    <SelectItem value="darken">Darken</SelectItem>
                                    <SelectItem value="difference">Difference</SelectItem>
                                    <SelectItem value="divide">Divide</SelectItem>
                                    <SelectItem value="dodge">Dodge</SelectItem>
                                    <SelectItem value="exclusion">Exclusion</SelectItem>
                                    <SelectItem value="extremity">Extremity</SelectItem>
                                    <SelectItem value="freeze">Freeze</SelectItem>
                                    <SelectItem value="geometric">Geometric</SelectItem>
                                    <SelectItem value="glow">Glow</SelectItem>
                                    <SelectItem value="grainextract">Grain Extract</SelectItem>
                                    <SelectItem value="grainmerge">Grain Merge</SelectItem>
                                    <SelectItem value="hardlight">Hard Light</SelectItem>
                                    <SelectItem value="hardmix">Hard Mix</SelectItem>
                                    <SelectItem value="hardoverlay">Hard Overlay</SelectItem>
                                    <SelectItem value="harmonic">Harmonic</SelectItem>
                                    <SelectItem value="heat">Heat</SelectItem>
                                    <SelectItem value="interpolate">Interpolate</SelectItem>
                                    <SelectItem value="lighten">Lighten</SelectItem>
                                    <SelectItem value="linearlight">Linear Light</SelectItem>
                                    <SelectItem value="multiply">Multiply</SelectItem>
                                    <SelectItem value="multiply128">Multiply 128</SelectItem>
                                    <SelectItem value="negation">Negation</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="or">Or</SelectItem>
                                    <SelectItem value="overlay">Overlay</SelectItem>
                                    <SelectItem value="phoenix">Phoenix</SelectItem>
                                    <SelectItem value="pinlight">Pin Light</SelectItem>
                                    <SelectItem value="reflect">Reflect</SelectItem>
                                    <SelectItem value="screen">Screen</SelectItem>
                                    <SelectItem value="softdifference">Soft Difference</SelectItem>
                                    <SelectItem value="softlight">Soft Light</SelectItem>
                                    <SelectItem value="stain">Stain</SelectItem>
                                    <SelectItem value="subtract">Subtract</SelectItem>
                                    <SelectItem value="vividlight">Vivid Light</SelectItem>
                                    <SelectItem value="xor">XOR</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="opacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Opacity</FormLabel>
                            <Input
                                {...field}
                                className="text-white"
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value))
                                }}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <Button type="submit" variant="default" className="bg-blue-500 text-white hover:bg-blue-600 w-full">Run</Button>
            </form>
        </Form>
    )
}