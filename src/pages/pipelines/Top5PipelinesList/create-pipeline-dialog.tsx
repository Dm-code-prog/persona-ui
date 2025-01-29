'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {useNavigate} from "react-router-dom";
import {useInitTop5PipelineMutation} from "@/hooks/data/local/old/useInitTop5PipelineMutation.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";

export function CreatePipelineDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [newPipeline, setNewPipeline] = useState('')
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const {toast} = useToast()

    const mutation = useInitTop5PipelineMutation()

    const handleCreatePipeline = () => {
        if (newPipeline) {
            mutation.mutate(
                {name: newPipeline},
                {
                    onSuccess: (data) => {
                        navigate(`/pipelines/top-5/${data.id}`)
                        toast({
                            title: "Pipeline created successfully",
                        })
                    },
                    onError: (error) => {
                        setError(error.message)
                    }
                },
            )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>New Pipeline</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Pipeline</DialogTitle>
                </DialogHeader>
                <Input
                    value={newPipeline}
                    onChange={(e) => setNewPipeline(e.target.value)}
                    placeholder="Pipeline name"
                />
                <Button onClick={handleCreatePipeline}>Create</Button>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    )
}

