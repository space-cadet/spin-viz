"use client"

import React, { useEffect, useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { PanelHeader } from './resizable-layout'

interface ResizablePanelsProps {
  panels: {
    title: string
    content: React.ReactNode
    defaultSize?: number
    minSize?: number
  }[]
  storageKey: string
  onMaximize?: (index: number) => void
  onMinimize?: (index: number) => void
  onClose?: (index: number) => void
  className?: string
}

export function ResizablePanels({
  panels,
  storageKey,
  onMaximize,
  onMinimize,
  onClose,
  className
}: ResizablePanelsProps) {
  // Initialize sizes based on panel count
  const defaultSizes = React.useMemo(() => {
    return panels.map(panel => panel.defaultSize || (100 / panels.length));
  }, [panels]);

  const [sizes, setSizes] = useState<number[]>(() => {
    if (panels.length === 0) return [];
    
    try {
      const saved = localStorage.getItem(`${storageKey}-sizes`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only use saved sizes if they match the current panel count
        if (Array.isArray(parsed) && parsed.length === panels.length) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load panel sizes:', error);
    }
    return defaultSizes;
  });

  // Update sizes when panel count changes
  useEffect(() => {
    if (panels.length !== sizes.length) {
      setSizes(defaultSizes);
    }
  }, [panels.length, defaultSizes]);

  // Save sizes to localStorage
  useEffect(() => {
    if (sizes.length > 0) {
      try {
        localStorage.setItem(`${storageKey}-sizes`, JSON.stringify(sizes));
      } catch (error) {
        console.error('Failed to save panel sizes:', error);
      }
    }
  }, [sizes, storageKey]);

  if (panels.length === 0) {
    return null;
  }

  return (
    <ResizablePanelGroup
      direction="vertical"
      className={cn('h-full w-full', className)}
      onLayout={setSizes}
    >
      {panels.map((panel, index) => (
        <React.Fragment key={panel.title}>
          {index > 0 && <ResizableHandle withHandle />}
          <ResizablePanel
            defaultSize={sizes[index] || defaultSizes[index]}
            minSize={panel.minSize || 10}
          >
            <Card className="flex flex-col h-full">
              <PanelHeader
                title={panel.title}
                onMaximize={() => onMaximize?.(index)}
                onMinimize={() => onMinimize?.(index)}
                onClose={() => onClose?.(index)}
              />
              <div className="flex-1 overflow-auto p-4">
                {panel.content}
              </div>
            </Card>
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
}