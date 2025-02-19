"use client"

import { Panel, PanelGroup } from "react-resizable-panels"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PanelHeader, ResizeHandle, VerticalResizeHandle } from "@/components/layout/resizable-layout"
import { SpinNetwork } from "./spin-network"

export default function SpinNetworkPage() {
  return (
    <div className="h-screen w-full flex flex-col">
      <PanelGroup direction="vertical">
        <Panel defaultSize={85}>
          <PanelGroup direction="horizontal">
            {/* Left Panels */}
            <Panel defaultSize={20} minSize={15}>
              <div className="h-full flex flex-col gap-2 p-2">
                {/* Scene Info Panel */}
                <Card className="flex-none">
                  <PanelHeader title="Scene Info" onMinimize={() => {}} onClose={() => {}} />
                  <div className="p-4">
                    <p>Total Nodes: 4</p>
                    <p>Total Edges: 5</p>
                  </div>
                </Card>

                {/* Properties Panel */}
                <Card className="flex-1">
                  <PanelHeader title="Properties" onMinimize={() => {}} onClose={() => {}} />
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

            {/* Center Viewport */}
            <Panel minSize={30}>
              <div className="h-full">
                <SpinNetwork />
              </div>
            </Panel>

            <ResizeHandle />

            {/* Right Panels */}
            <Panel defaultSize={20} minSize={15}>
              <div className="h-full flex flex-col gap-2 p-2">
                {/* Tools Panel */}
                <Card className="flex-none">
                  <PanelHeader title="Tools" onMinimize={() => {}} onClose={() => {}} />
                  <div className="p-4 space-y-2">
                    <Button className="w-full">New Node</Button>
                    <Button className="w-full">Delete Selected</Button>
                  </div>
                </Card>

                {/* Object List Panel */}
                <Card className="flex-1">
                  <PanelHeader title="Object List" onMinimize={() => {}} onClose={() => {}} />
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
          </PanelGroup>
        </Panel>

        <VerticalResizeHandle />

        {/* Bottom Panel */}
        <Panel defaultSize={15}>
          <Card className="h-full mx-2 mb-2">
            <PanelHeader title="LLM Interaction" onMinimize={() => {}} onClose={() => {}} />
            <div className="p-4 h-full flex flex-col">
              <div className="flex-1 bg-muted/20 rounded mb-2"></div>
              <Input placeholder="Enter your message here..." />
            </div>
          </Card>
        </Panel>
      </PanelGroup>
    </div>
  )
}

