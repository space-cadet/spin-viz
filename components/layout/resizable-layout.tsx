"use client"

import { PanelResizeHandle } from "react-resizable-panels"
import { Minus, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PanelHeaderProps {
  title: string
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}

export function PanelHeader({ title, onMinimize, onMaximize, onClose }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/50">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="flex items-center gap-1">
        {onMinimize && (
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onMinimize}>
            <Minus className="h-3 w-3" />
          </Button>
        )}
        {onMaximize && (
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onMaximize}>
            <Maximize2 className="h-3 w-3" />
          </Button>
        )}
        {onClose && (
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function ResizeHandle({ className = "" }: { className?: string }) {
  return (
    <PanelResizeHandle className={cn("w-2 bg-muted/50 hover:bg-muted transition-colors", className)}>
      <div className="w-0.5 h-full mx-auto bg-border" />
    </PanelResizeHandle>
  )
}

export function VerticalResizeHandle({ className = "" }: { className?: string }) {
  return (
    <PanelResizeHandle className={cn("h-2 bg-muted/50 hover:bg-muted transition-colors", className)}>
      <div className="h-0.5 w-full my-auto bg-border" />
    </PanelResizeHandle>
  )
}

