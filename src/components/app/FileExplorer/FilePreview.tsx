import {motion, AnimatePresence} from "framer-motion"
import {X, Download} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useDownloadFileQuery} from "@/hooks/data/local/projects/useDownloadFileQuery.ts";

type FilePreviewModalProps = {
    project_id: string
    file_path: string
    onClose: () => void
}

export function FilePreviewModal({project_id, file_path, onClose}: FilePreviewModalProps) {
    const {data: url, error, isPending} = useDownloadFileQuery({
        project_id: project_id,
        file_path: file_path
    })

    const onDownload = () => {
        const a = document.createElement("a")
        a.href = url!
        a.download = file_path
        a.click()
    }

    if (error) {
        return null
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.9, opacity: 0}}
                    transition={{type: "spring", damping: 15}}
                    className="bg-secondary rounded-lg p-6 max-w-3xl w-full mx-4 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="h-6 w-6"/>
                    </Button>
                    <h3 className="text-xl font-semibold mb-4">{file_path}</h3>
                    <div className="aspect-video bg-background rounded-lg overflow-hidden mb-4">
                        {file_path.includes("photos") ? (
                            <img
                                src={url}
                                alt={file_path}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video src={url} controls
                                   className="w-full h-full"/>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <Button
                            disabled={isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                            onClick={onDownload}
                        >
                            {isPending ? (
                                <motion.div
                                    animate={{rotate: 360}}
                                    transition={{duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
                                >
                                    <Download className="mr-2 h-4 w-4"/>
                                </motion.div>
                            ) : (
                                <Download className="mr-2 h-4 w-4"/>
                            )}
                            {isPending ? "Downloading..." : "Download"}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

