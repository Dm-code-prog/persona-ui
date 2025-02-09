import {useEffect} from 'react'
import {motion, useAnimate} from 'framer-motion'
import {AlertCircle, RefreshCw} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'

interface ErrorComponentProps {
    error: Error
    reset?: () => void
}

export function ErrorUI({error, reset}: ErrorComponentProps) {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        animate(scope.current, {scale: [0.9, 1.1, 1]}, {duration: 0.5})
    }, [animate, scope])

    return (
        <div className="flex w-full items-center justify-center min-h-[400px] bg-red-500 opacity-80 p-4">
            <motion.div ref={scope} initial={{scale: 0.9}} className="w-full max-w-md">
                <Card className="border-red-200 shadow-lg bg-background">
                    <CardHeader className="border-b border-red-100">
                        <CardTitle className="text-red-700 flex items-center gap-2">
                            <AlertCircle className="h-6 w-6"/>
                            Oops! Something went wrong {error.message}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className=" mb-4">We encountered an error while processing your request:</p>
                        <div className=" border border-red-200 rounded p-3 text-red-600 font-mono text-sm">
                            {error.message}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t border-gray-100">
                        <p className="text-sm ">
                            If the problem persists, please contact support.
                        </p>
                        {reset && (
                            <Button
                                variant="outline"
                                onClick={reset}
                                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4"/>
                                Try Again
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

