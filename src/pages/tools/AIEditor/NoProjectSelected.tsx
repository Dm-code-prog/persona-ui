import { FolderOpen } from "lucide-react"

export default function NoProjectBanner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-2xl w-full mx-4">
        <div className="relative bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
          <div className="relative p-8 md:p-12 flex flex-col items-center text-center z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to AI Editor</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Your AI-powered suite for creating amazing YouTube content
            </p>
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
              <FolderOpen className="w-12 h-12 text-primary" />
            </div>
            <p className="text-xl md:text-2xl font-semibold mb-8">No Project Selected</p>
        
          </div>
        </div>
      </div>
    </div>
  )
}

