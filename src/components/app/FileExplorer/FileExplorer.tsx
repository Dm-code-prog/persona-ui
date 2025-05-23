import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { FaFile, FaFileVideo, FaFileImage, FaFileAudio, FaFileCode } from "react-icons/fa"
import { Folder, Trash2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { toast, useToast } from "@/hooks/use-toast.ts";
import { useUploadProjectFileMutation } from "@/hooks/data/local/projects/useUploadProjectFileMutation.ts";
import { useListProjectFilesQuery } from "@/hooks/data/local/projects/useListProjectFilesQuery.ts";
import { FilePreviewModal } from "@/components/app/FileExplorer/FilePreview.tsx";
import { useDeleteProjectFileMutation } from "@/hooks/data/local/projects/useDeleteProjectFileMutation"

type FileNode = {
    name: string
    type: "file" | "folder"
    path: string
    children?: FileNode[]
}

const FileIcon = ({ type, name }: { type: string; name: string }) => {
    if (type === "folder") return <Folder className="text-purple-500" />
    if (name.endsWith(".mp4")) return <FaFileVideo className="text-purple-500" />
    if (name.endsWith(".jpg") || name.endsWith(".png")) return <FaFileImage className="text-green-500" />
    if (name.endsWith(".mp3") || name.endsWith(".wav")) return <FaFileAudio className="text-purple-500" />
    if (name.includes("effect")) return <FaFileCode className="text-red-500" />
    return <FaFile className="text-gray-500" />
}

const FileTree = ({ node, project_id, level = 0 }: { node: FileNode; project_id: string; level?: number }) => {
    const [isOpen, setIsOpen] = useState(true)
    const toggleOpen = () => setIsOpen(!isOpen)

    const [previewIsOpen, setPreviewIsOpen] = useState(false)

    const onClick = () => {
        toggleOpen()

        if (!node.children) {
            setPreviewIsOpen(true)
        }
    }

    const deleteMutation = useDeleteProjectFileMutation(project_id)

    const onDelete = async (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation()

        if (node.children) return

        try {
            await deleteMutation.mutateAsync({ file_path: node.path, })
        } catch (error) {
            toast({
                title: "Error deleting file",
                description: `There was an error deleting your file: ${error}. Please try again.`,
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: level * 0.1 }}
        >
            <div
                className={`flex w-full items-center justify-between space-x-2 p-2 rounded-lg hover:bg-accent cursor-pointer`}
                onClick={onClick}
            >
                <div className="flex items-center space-x-2">
                    <FileIcon type={node.type} name={node.name} />
                    <span>{node.name}</span>
                </div>
                {!node.children && <Trash2 className="text-destructive" width={16} height={16} onClick={onDelete} />}
            </div>
            <AnimatePresence>
                {isOpen && node.children && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4"
                    >
                        {node.children.map((child, index) => (
                            <FileTree project_id={project_id} key={index} node={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            {
                previewIsOpen && (
                    <FilePreviewModal
                        project_id={project_id}
                        file_path={node.path}
                        onClose={() => setPreviewIsOpen(false)}
                    />
                )
            }
        </motion.div>
    )
}

const FileUploader = (
    { project_id, }:
        { project_id: string }
) => {
    const [uploadProgress, setUploadProgress] = useState(0)
    const { toast } = useToast()
    const uploadMutation = useUploadProjectFileMutation(project_id)

    const [fileType, setFileType] = useState("video");

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        try {
            await uploadMutation.mutateAsync(
                {
                    file_type: fileType,
                    file: file,
                }
            )

            toast({
                title: "File uploaded successfully",
                description: `${file.name} has been uploaded.`,
            })
        } catch (error) {
            toast({
                title: "Upload failed",
                description: `There was an error uploading your file: ${error}. Please try again.`,
                variant: "destructive",
            })
        } finally {
            setUploadProgress(0)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div>
            <Tabs defaultValue="account" className="w-[400px] py-4" onValueChange={setFileType} value={fileType}>
                <TabsList>
                    <TabsTrigger value="video">Video</TabsTrigger>
                    <TabsTrigger value="music">Music</TabsTrigger>
                    <TabsTrigger value="video_effect">Video effect</TabsTrigger>
                    <TabsTrigger value="photo">Photo</TabsTrigger>
                </TabsList>
            </Tabs>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
                    }`}
            >
                <input {...getInputProps()} />
                <p className="text-lg font-medium mb-2">
                    {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
                </p>
                <p className="text-sm text-gray-500">Supported file types: video, photo, sound effect, video effect</p>
            </div>
            {uploadProgress > 0 && (
                <div className="mt-4">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-500 mt-2">Uploading: {uploadProgress}%</p>
                </div>
            )}
        </div>
    )
}

function parseNestedObjectToFileNode(
    // @eslint-ignore-next-line
    obj: any,
    nodeName: string,
    parentPath = ""
): FileNode {
    // Build the path by appending the current node to the parent's path
    const nodePath = parentPath ? `${parentPath}/${nodeName}` : nodeName;

    // Always treat this level as a folder (unless you have some special leaf logic)
    const node: FileNode = {
        name: nodeName,
        type: "folder",
        // remove root from the start
        path: nodePath.replace(/^root\//, ""),
        children: [],
    };

    // If "obj" is null, we'll just return an empty folder
    if (obj === null) {
        return node;
    }

    // If it's an array, treat each element as a file
    if (Array.isArray(obj)) {
        node.children = obj.map<FileNode>((item: string) => ({
            name: item,
            type: "file",
            // Build path for each item in array
            path: `${nodePath}/${item}`.replace(/^root\//, ""),
        }));
        return node;
    }

    // If it's an object, recurse for each key
    if (typeof obj === "object") {
        Object.entries(obj).forEach(([key, value]) => {
            const childNode = parseNestedObjectToFileNode(value, key, nodePath);
            node.children?.push(childNode);
        });
    }

    return node;
}

export default function FileExplorer({ project_id }: { project_id: string }) {
    const { data: filesData, isLoading, isError } = useListProjectFilesQuery(project_id)
    const fileTree = filesData
        ? parseNestedObjectToFileNode(filesData, "root")
        : null

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">File Explorer</h3>
                        {isLoading && <p>Loading files...</p>}
                        {isError && <p className="text-red-500">Error loading files. Please try again.</p>}
                        {fileTree && fileTree.children && (
                            <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                                {fileTree.children.map((node, index) => (
                                    <FileTree project_id={project_id} key={index} node={node} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">File Uploader</h3>
                        <FileUploader project_id={project_id} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}