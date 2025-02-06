import { useState } from "react"
import { Scissors, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PauseCutterForm } from "./PauseCutterTool.tsx"
import { UnifierToolForm } from "./UnifierTool.tsx"

export function Toolbar() {
    const [isPauseCutterOpen, setIsPauseCutterOpen] = useState(false)
    const [isUnifierOpen, setIsUnifierOpen] = useState(false)

    return (
        <TooltipProvider>
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-secondary bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 rounded-l-lg shadow-lg">
                <div className="flex flex-col space-y-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsPauseCutterOpen(true)}
                                className="text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-110"
                            >
                                <Scissors className="h-6 w-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-secondary text-white">
                            <p>Pause Cutter</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setIsUnifierOpen(true)}>
                                <Wand2 className="h-6 w-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-secondary text-white">
                            <p>Unifier</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <Dialog open={isPauseCutterOpen} onOpenChange={setIsPauseCutterOpen}>
                <DialogContent className="bg-background text-white border-accent">
                    <DialogHeader>
                        <DialogTitle>Cut pauses</DialogTitle>
                    </DialogHeader>
                    <PauseCutterForm onClose={() => setIsPauseCutterOpen(false)} />
                </DialogContent>
            </Dialog>
            <Dialog open={isUnifierOpen} onOpenChange={setIsUnifierOpen}>
                <DialogContent className="bg-background text-white border-accent">
                    <DialogHeader>
                        <DialogTitle>Unifier</DialogTitle>
                    </DialogHeader>
                    <UnifierToolForm onClose={() => setIsUnifierOpen(false)} />
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    )
}

