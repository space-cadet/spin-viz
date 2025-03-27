"use client"

import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable';
import { cn } from '@/lib/utils';

interface ResizablePanelContainerProps {
  children: React.ReactNode[];
  direction?: 'vertical' | 'horizontal';
  className?: string;
  defaultSizes?: number[];
  minSizes?: number[];
  onLayout?: (sizes: number[]) => void;
}

const PANEL_STORAGE_KEY = 'sidebar-panel-sizes';

const ResizablePanelContainer = ({
  children,
  direction = 'vertical',
  className,
  defaultSizes,
  minSizes,
  onLayout,
}: ResizablePanelContainerProps) => {
  // If defaultSizes not provided, distribute evenly
  const initialSizes = defaultSizes || Array(children.length).fill(100 / children.length);
  // Default minimum size of 10% for each panel if not specified
  const panelMinSizes = minSizes || Array(children.length).fill(10);

  const handleLayout = React.useCallback((sizes: number[]) => {
    try {
      localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(sizes));
    } catch (error) {
      console.error('Failed to save panel sizes:', error);
    }
    onLayout?.(sizes);
  }, [onLayout]);

  const loadSavedSizes = React.useCallback(() => {
    try {
      const saved = localStorage.getItem(PANEL_STORAGE_KEY);
      if (saved) {
        const sizes = JSON.parse(saved);
        if (Array.isArray(sizes) && sizes.length === children.length) {
          return sizes;
        }
      }
    } catch (error) {
      console.error('Failed to load saved panel sizes:', error);
    }
    return initialSizes;
  }, [children.length, initialSizes]);

  return (
    <ResizablePanelGroup
      direction={direction}
      className={cn(
        direction === 'vertical' ? 'flex flex-col' : 'flex',
        'h-full w-full',
        className
      )}
      onLayout={handleLayout}
    >
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ResizableHandle withHandle />}
          <ResizablePanel
            defaultSize={loadSavedSizes()[index]}
            minSize={panelMinSizes[index]}
            className="h-full w-full"
          >
            {child}
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

export { ResizablePanelContainer };
