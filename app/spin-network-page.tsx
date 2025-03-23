"use client"

import { useState, useEffect } from "react"
import { Panel, PanelGroup } from "react-resizable-panels"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PanelHeader, ResizeHandle, VerticalResizeHandle } from "@/components/layout/resizable-layout"
import { SpinNetwork } from "./spin-network"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type PanelVisibility = {
  left: boolean
  right: boolean
  bottom: boolean
}

type PanelSizes = {
  left: number
  right: number
  bottom: number
}

type MaximizedState = {
  left: boolean
  right: boolean
  bottom: boolean
}

const DEFAULT_SIZES: PanelSizes = {
  left: 20,
  right: 20,
  bottom: 15
}

const MAXIMIZED_SIZES: PanelSizes = {
  left: 40,
  right: 40,
  bottom: 30
}

export default function SpinNetworkPage() {
  const [visibility, setVisibility] = useState<PanelVisibility>({
    left: true,
    right: true,
    bottom: true
  })

  const [sizes, setSizes] = useState<PanelSizes>(DEFAULT_SIZES)

  const [maximized, setMaximized] = useState<MaximizedState>({
    left: false,
    right: false,
    bottom: false
  })

  // Load state from localStorage
  useEffect(() => {
    const savedVisibility = localStorage.getItem('panelVisibility')
    const savedSizes = localStorage.getItem('panelSizes')
    const savedMaximized = localStorage.getItem('panelMaximized')
    if (savedVisibility) {
      setVisibility(JSON.parse(savedVisibility))
    }
    if (savedSizes) {
      setSizes(JSON.parse(savedSizes))
    }
    if (savedMaximized) {
      setMaximized(JSON.parse(savedMaximized))
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('panelVisibility', JSON.stringify(visibility))
    localStorage.setItem('panelSizes', JSON.stringify(sizes))
    localStorage.setItem('panelMaximized', JSON.stringify(maximized))
  }, [visibility, sizes, maximized])

  const handleMinimize = (panel: keyof PanelVisibility) => {
    setVisibility(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }))
  }

  const handleClose = (panel: keyof PanelVisibility) => {
    setVisibility(prev => ({
      ...prev,
      [panel]: false
    }))
    // Reset maximized state when closing
    setMaximized(prev => ({
      ...prev,
      [panel]: false
    }))
  }

  const handleMaximize = (panel: keyof MaximizedState) => {
    setMaximized(prev => {
      const newMaximized = {
        ...prev,
        [panel]: !prev[panel]
      }
      
      // Update sizes based on maximized state
      setSizes(prevSizes => ({
        ...DEFAULT_SIZES,
        [panel]: newMaximized[panel] ? MAXIMIZED_SIZES[panel] : DEFAULT_SIZES[panel]
      }))

      return newMaximized
    })
  }

  const handlePanelResize = (panel: keyof PanelSizes, size: number) => {
    setSizes(prev => ({
      ...prev,
      [panel]: size
    }))
  }

  const renderPanelHeader = (title: string, panel: keyof PanelVisibility) => (
    <TooltipProvider>
      <PanelHeader 
        title={title} 
        onMinimize={() => handleMinimize(panel)}
        onMaximize={() => handleMaximize(panel)}
        onClose={() => handleClose(panel)} 
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${maximized[panel] ? 'border-2 border-primary' : ''}`} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{maximized[panel] ? 'Restore' : 'Maximize'}</p>
          </TooltipContent>
        </Tooltip>
      </PanelHeader>
    </TooltipProvider>
  )

  return (
    <div className="h-screen w-full flex flex-col">
      <PanelGroup direction="vertical" onLayout={(sizes) => handlePanelResize('bottom', sizes[1])}>
        <Panel defaultSize={85}>
          <PanelGroup direction="horizontal">
            {/* Left Panels */}
            {visibility.left && (
              <>
                <Panel 
                  defaultSize={sizes.left} 
                  minSize={15}
                  maxSize={maximized.left ? 60 : 40}
                  onResize={(size) => handlePanelResize('left', size)}
                >
                  <div className="h-full flex flex-col gap-2 p-2">
                    {/* Scene Info Panel */}
                    <Card className="flex-none">
                      {renderPanelHeader("Scene Info", "left")}
                      <div className="p-4">
                        <p>Total Nodes: 4</p>
                        <p>Total Edges: 5</p>
                      </div>
                    </Card>

                    {/* Properties Panel */}
                    <Card className="flex-1">
                      {renderPanelHeader("Properties", "left")}
                      <div className="p-4 space-y-4">
                        <div>
                          <Label>Position</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div>
                              <Label className="text-xs">X</Label>
                              <Input type="number" defaultValue="0.00" />
                            </div>
                            <div>
                              <Label className="text-xs">Y</Label>
                              <Input type="number" defaultValue="0.00" />
                            </div>
                            <div>
                              <Label className="text-xs">Z</Label>
                              <Input type="number" defaultValue="0.00" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Panel>
                <ResizeHandle />
              </>
            )}

            {/* Center Viewport */}
            <Panel minSize={30}>
              <div className="h-full">
                <SpinNetwork />
              </div>
            </Panel>

            {/* Right Panels */}
            {visibility.right && (
              <>
                <ResizeHandle />
                <Panel 
                  defaultSize={sizes.right} 
                  minSize={15}
                  maxSize={maximized.right ? 60 : 40}
                  onResize={(size) => handlePanelResize('right', size)}
                >
                  <div className="h-full flex flex-col gap-2 p-2">
                    {/* Tools Panel */}
                    <Card className="flex-none">
                      {renderPanelHeader("Tools", "right")}
                      <div className="p-4 space-y-2">
                        <Button className="w-full">New Node</Button>
                        <Button className="w-full">Delete Selected</Button>
                      </div>
                    </Card>

                    {/* Object List Panel */}
                    <Card className="flex-1">
                      {renderPanelHeader("Object List", "right")}
                      <div className="p-4">
                        <div className="space-y-1">
                          <div className="px-2 py-1 bg-muted/50 rounded">Node_1</div>
                          <div className="px-2 py-1 bg-muted/50 rounded">Node_2</div>
                          <div className="px-2 py-1 bg-muted/50 rounded">Node_3</div>
                          <div className="px-2 py-1 bg-muted/50 rounded">Node_4</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>

        <VerticalResizeHandle />

        {/* Bottom Panel */}
        {visibility.bottom && (
          <Panel 
            defaultSize={sizes.bottom}
            minSize={10}
            maxSize={maximized.bottom ? 50 : 30}
            onResize={(size) => handlePanelResize('bottom', size)}
          >
            <Card className="h-full mx-2 mb-2">
              {renderPanelHeader("LLM Interaction", "bottom")}
              <div className="p-4 h-full flex flex-col">
                <div className="flex-1 bg-muted/20 rounded mb-2"></div>
                <Input placeholder="Enter your message here..." />
              </div>
            </Card>
          </Panel>
        )}
      </PanelGroup>
    </div>
  )
}
