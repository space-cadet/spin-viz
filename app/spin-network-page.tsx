"use client"

import { useState, useEffect } from "react"
import { Panel, PanelGroup } from "react-resizable-panels"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PanelHeader, ResizeHandle } from "@/components/layout/resizable-layout"
import { ResizablePanels } from "@/components/layout/resizable-panels"
import { SpinNetwork } from "./spin-network"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"

type PanelVisibility = {
  [key: string]: boolean
}

type PanelSizes = {
  left: number
  right: number
  bottom: number
}

type MaximizedState = {
  [key: string]: boolean
}

const DEFAULT_SIZES: PanelSizes = {
  left: 25,
  right: 25,
  bottom: 20
}

const MIN_SIZES = {
  left: 15,
  right: 15,
  bottom: 10
}

const MAX_SIZES = {
  left: 60,
  right: 60,
  bottom: 50
}

// Panel configurations
const BOTTOM_PANELS = [
  {
    id: "llm-interaction",
    title: "LLM Interaction",
    content: (
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-muted/20 rounded mb-2"></div>
        <Input placeholder="Enter your message here..." />
      </div>
    ),
    defaultSize: 100,
    minSize: 30
  }
]

const LEFT_PANELS = [
  {
    id: "scene-info",
    title: "Scene Info",
    content: (
      <div>
        <p>Total Nodes: 4</p>
        <p>Total Edges: 5</p>
      </div>
    ),
    defaultSize: 30,
    minSize: 20
  },
  {
    id: "properties",
    title: "Properties",
    content: (
      <div className="space-y-4">
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
    ),
    defaultSize: 70,
    minSize: 30
  }
]

const RIGHT_PANELS = [
  {
    id: "tools",
    title: "Tools",
    content: (
      <div className="space-y-2">
        <Button className="w-full">New Node</Button>
        <Button className="w-full">Delete Selected</Button>
      </div>
    ),
    defaultSize: 30,
    minSize: 20
  },
  {
    id: "object-list",
    title: "Object List",
    content: (
      <div className="space-y-1">
        <div className="px-2 py-1 bg-muted/50 rounded">Node_1</div>
        <div className="px-2 py-1 bg-muted/50 rounded">Node_2</div>
        <div className="px-2 py-1 bg-muted/50 rounded">Node_3</div>
        <div className="px-2 py-1 bg-muted/50 rounded">Node_4</div>
      </div>
    ),
    defaultSize: 70,
    minSize: 30
  }
]

export default function SpinNetworkPage() {
  const [visibility, setVisibility] = useState<PanelVisibility>(() => {
    const initialVisibility: PanelVisibility = {};
    [...LEFT_PANELS, ...RIGHT_PANELS, ...BOTTOM_PANELS].forEach(panel => {
      initialVisibility[panel.id] = true;
    });
    return initialVisibility;
  });

  const [sizes, setSizes] = useState<PanelSizes>(DEFAULT_SIZES)
  const [maximized, setMaximized] = useState<MaximizedState>(() => {
    const initialMaximized: MaximizedState = {};
    [...LEFT_PANELS, ...RIGHT_PANELS, ...BOTTOM_PANELS].forEach(panel => {
      initialMaximized[panel.id] = false;
    });
    return initialMaximized;
  });

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

  const handleMinimize = (panelId: string) => {
    setVisibility(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }))
  }

  const handleClose = (panelId: string) => {
    setVisibility(prev => ({
      ...prev,
      [panelId]: false
    }))
    // Reset maximized state when closing
    setMaximized(prev => ({
      ...prev,
      [panelId]: false
    }))
  }

  const handleMaximize = (panelId: string) => {
    setMaximized(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }))
  }

  const handlePanelResize = (panel: keyof PanelSizes, newSizes: number[]) => {
    setSizes(prev => ({
      ...prev,
      [panel]: newSizes[1] // Using the second panel's size as it represents the main content
    }))
  }

  const handleReopenPanel = (panelId: string) => {
    setVisibility(prev => ({
      ...prev,
      [panelId]: true
    }))
  }

  // Filter visible panels
  const visibleLeftPanels = LEFT_PANELS.filter(panel => visibility[panel.id])
  const visibleRightPanels = RIGHT_PANELS.filter(panel => visibility[panel.id])
  const visibleBottomPanels = BOTTOM_PANELS.filter(panel => visibility[panel.id])

  const showLeftPanels = visibleLeftPanels.length > 0;
  const showRightPanels = visibleRightPanels.length > 0;
  const showBottomPanels = visibleBottomPanels.length > 0;

  const renderViewMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Menu className="h-4 w-4" />
          <span className="ml-2">View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[...LEFT_PANELS, ...RIGHT_PANELS, ...BOTTOM_PANELS].map(panel => (
          <DropdownMenuItem
            key={panel.id}
            onClick={() => handleReopenPanel(panel.id)}
            disabled={visibility[panel.id]}
          >
            {panel.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="p-2 flex justify-end border-b">
        {renderViewMenu()}
      </div>
      <div className="flex-1">
        <PanelGroup direction="vertical">
          <Panel defaultSize={80} minSize={50} maxSize={90} className="h-full">
            <div className="h-full flex">
              {/* Left Panel Group */}
              {showLeftPanels && (
                <PanelGroup direction="horizontal">
                  <Panel defaultSize={sizes.left} minSize={MIN_SIZES.left} maxSize={MAX_SIZES.left}>
                    <ResizablePanels
                      storageKey="left-sidebar"
                      panels={visibleLeftPanels}
                      onMaximize={(index) => handleMaximize(visibleLeftPanels[index].id)}
                      onMinimize={(index) => handleMinimize(visibleLeftPanels[index].id)}
                      onClose={(index) => handleClose(visibleLeftPanels[index].id)}
                    />
                  </Panel>
                  <ResizeHandle />
                  <Panel minSize={30}>
                    <div className="h-full">
                      <SpinNetwork />
                    </div>
                  </Panel>
                </PanelGroup>
              )}

              {/* Center Panel (when no left panels) */}
              {!showLeftPanels && !showRightPanels && (
                <div className="flex-1">
                  <SpinNetwork />
                </div>
              )}

              {/* Right Panel Group */}
              {showRightPanels && (
                <PanelGroup direction="horizontal">
                  <Panel minSize={30}>
                    <div className="h-full">
                      {!showLeftPanels && <SpinNetwork />}
                    </div>
                  </Panel>
                  <ResizeHandle />
                  <Panel defaultSize={sizes.right} minSize={MIN_SIZES.right} maxSize={MAX_SIZES.right}>
                    <ResizablePanels
                      storageKey="right-sidebar"
                      panels={visibleRightPanels}
                      onMaximize={(index) => handleMaximize(visibleRightPanels[index].id)}
                      onMinimize={(index) => handleMinimize(visibleRightPanels[index].id)}
                      onClose={(index) => handleClose(visibleRightPanels[index].id)}
                    />
                  </Panel>
                </PanelGroup>
              )}
            </div>
          </Panel>

          {/* Bottom Panel */}
          {showBottomPanels && (
            <>
              <ResizeHandle />
              <Panel defaultSize={sizes.bottom} minSize={MIN_SIZES.bottom} maxSize={MAX_SIZES.bottom}>
                <ResizablePanels
                  storageKey="bottom-sidebar"
                  panels={visibleBottomPanels}
                  onMaximize={(index) => handleMaximize(visibleBottomPanels[index].id)}
                  onMinimize={(index) => handleMinimize(visibleBottomPanels[index].id)}
                  onClose={(index) => handleClose(visibleBottomPanels[index].id)}
                />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  )
}