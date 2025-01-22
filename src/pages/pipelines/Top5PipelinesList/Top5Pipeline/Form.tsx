import {z} from "zod";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"

import {useGetTop5PipelineQuery} from "@/hooks/data/local/useGetTop5PipelineQuery.ts";
import {useParams} from "react-router-dom";
import {motion} from "framer-motion";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";
import Loader from "@/components/app/Loader/Loader.tsx";
import {ErrorUI} from "@/components/app/Error/Error.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useListTop5PipelineFilesQuery} from "@/hooks/data/local/useListTop5PipelineFilesQuery";


// Zod schema for form validation
const formSchema = z.object({
    background_video: z.string(),
    background_music: z.string(),
    video_effect: z.string(),
    places_videos: z.array(z.string()),
    script: z.string().min(10, "Script must be at least 10 characters long"),
    subtitle_color: z
        .string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color")
        .or(z.string().min(3, "Must be a valid color name")),
    subtitle_highlight_color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color"),
    background_music_volume_adjustment: z.number().min(-50).max(0),
})

type FormValues = z.infer<typeof formSchema>

export const Top5PipelineForm = () => {
    const {id} = useParams()
    const {data: pipelineData, isLoading: isPipelineLoading, error} = useGetTop5PipelineQuery(id!)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const files = useListTop5PipelineFilesQuery(id!)

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            script: pipelineData?.script || "",
            subtitle_color: pipelineData?.subtitle_color || "white",
            subtitle_highlight_color: pipelineData?.subtitle_highlight_color || "#7710e2",
            background_music_volume_adjustment: pipelineData?.volume_adjustment || -25,
        },
    })

    console.log(errors)

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(data)
        setIsSubmitting(false)
    }

    if (error) {
        return <ErrorUI error={error}/>
    }

    if (files.error) {
        return <ErrorUI error={files.error}/>
    }

    if (isPipelineLoading) {
        return <Loader/>
    }

    if (files.isLoading) {
        return <Loader/>
    }

    return (
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
            <Card className="w-full min-w-[600px] mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Run Top 5 Pipeline</CardTitle>
                    <CardDescription className="text-center">Configure your video pipeline settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex justify-between items-center w-full flex-grow gap-4">
                            <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.2}} className="w-full">
                                <Label htmlFor="background_video">Background Video</Label>
                                <Controller
                                    name="background_music"
                                    control={control}
                                    render={({field}) => (
                                        <Select {...field}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick the background video"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    files?.data?.input?.videos?.map((video) => (
                                                        <SelectItem value={video}>{video}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>

                                    )}
                                />
                                {errors.script && <p className="text-red-500 text-sm mt-1">{errors.script.message}</p>}
                            </motion.div>
                            <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.2}} className="w-full">
                                <Label htmlFor="background_video">Background music</Label>
                                <Controller
                                    name="background_video"
                                    control={control}
                                    render={({field}) => (
                                        <Select {...field}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick the background music"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    files?.data?.input?.music?.map((music) => (
                                                        <SelectItem value={music}>{music}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>

                                    )}
                                />
                                {errors.script && <p className="text-red-500 text-sm mt-1">{errors.script.message}</p>}
                            </motion.div>
                        </div>
                        <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.2}}>
                            <Label htmlFor="script">Video Script</Label>
                            <Controller
                                name="script"
                                control={control}
                                render={({field}) => (
                                    <Textarea {...field} id="script" placeholder="Enter your video script here..."
                                              className="mt-1"/>
                                )}
                            />
                            {errors.script && <p className="text-red-500 text-sm mt-1">{errors.script.message}</p>}
                        </motion.div>

                        <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.3}}>
                            <Label htmlFor="subtitle_color">Subtitle Color</Label>
                            <Controller
                                name="subtitle_color"
                                control={control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        id="subtitle_color"
                                        type="text"
                                        placeholder="Enter subtitle color (e.g., white or #FFFFFF)"
                                        className="mt-1"
                                    />
                                )}
                            />
                            {errors.subtitle_color &&
                                <p className="text-red-500 text-sm mt-1">{errors.subtitle_color.message}</p>}
                        </motion.div>

                        <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.4}}>
                            <Label htmlFor="subtitle_highlight_color">Subtitle Highlight Color</Label>
                            <Controller
                                name="subtitle_highlight_color"
                                control={control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        id="subtitle_highlight_color"
                                        type="text"
                                        placeholder="Enter subtitle highlight color (e.g., #7710e2)"
                                        className="mt-1"
                                    />
                                )}
                            />
                            {errors.subtitle_highlight_color && (
                                <p className="text-red-500 text-sm mt-1">{errors.subtitle_highlight_color.message}</p>
                            )}
                        </motion.div>

                        <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.5}}>
                            <Label htmlFor="background_music_volume_adjustment">Background Music Volume Adjustment
                                (dB)</Label>
                            <Controller
                                name="background_music_volume_adjustment"
                                control={control}
                                render={({field}) => (
                                    <Input
                                        {...field}
                                        id="background_music_volume_adjustment"
                                        type="number"
                                        min="-50"
                                        max="0"
                                        step="1"
                                        className="mt-1"
                                    />
                                )}
                            />
                            {errors.background_music_volume_adjustment && (
                                <p className="text-red-500 text-sm mt-1">{errors.background_music_volume_adjustment.message}</p>
                            )}
                        </motion.div>
                    </form>
                </CardContent>
                <CardFooter>
                    <motion.div className="w-full" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:shadow-lg"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Running Pipeline...
                                </>
                            ) : (
                                "Run Pipeline"
                            )}
                        </Button>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}