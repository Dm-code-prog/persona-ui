import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCreateTrackedYoutubeChannelMutation } from "@/hooks/data/local/analytics/useCreateTrackedYoutubeChannelMutation"

const formSchema = z.object({
    channelUrl: z.string().url("Please enter a valid YouTube channel URL"),
    tag: z.string().min(1, "Tag is required"),
})

type FormData = z.infer<typeof formSchema>

export function AddChannelDialog() {
    const [open, setOpen] = useState(false)
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelUrl: "",
            tag: "",
        },
    })

    const mutation = useCreateTrackedYoutubeChannelMutation()
    const { toast } = useToast()

    const handleAddChannel = async (data: FormData) => {
        try {
            await mutation.mutateAsync({ channel_url: data.channelUrl, tag: data.tag })

            toast({
                title: "Channel added",
                description: "Channel added successfully",
            })
            form.reset()
            setOpen(false)
        } catch (error) {
            console.error(error)
            toast({
                title: "Channel not added",
                description: "Channel not added successfully",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Track new channel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background">
                <DialogHeader>
                    <DialogTitle>Add New Channel</DialogTitle>
                    <DialogDescription>Enter the YouTube channel URL and a tag for the new channel.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddChannel)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="channelUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Channel URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://www.youtube.com/channel/..." {...field} />
                                    </FormControl>
                                    <FormDescription>Enter the full URL of the YouTube channel.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Technology, Music, Education" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter a tag to categorize this channel.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Add Channel
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

