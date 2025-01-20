import {useEffect, useState} from 'react'
import {AlertCircle} from 'lucide-react'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog'

import {usePing} from '@/hooks/data/local/usePing.ts'

export function LocalProgramStatusModal() {
    const isAvailable = usePing()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(!isAvailable)
    }, [isAvailable])

    return (
        <Dialog open={isOpen} onOpenChange={(o) => setIsOpen(o)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-red-500"/>
                        Local Backend Unavailable
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p className="mt-2 text-sm text-gray-500">
                        The local backend running on localhost:8000 is currently unavailable. It is required for this
                        application to function.
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        Please ensure that:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                        <li>The local backend is running on your machine</li>
                        <li>It's configured to use port 8000</li>
                        <li>There are no firewall or network issues preventing the connection</li>
                    </ul>
                    <p className="mt-4 text-sm text-gray-500">
                        Once the program is available, this message will automatically disappear.
                    </p>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

