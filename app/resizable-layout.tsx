"use client"

import type React from "react"

import { PanelGroup } from "react-resizable-panels"

export const ResizableLayout = ({ children }: { children: React.ReactNode }) => {
  return <PanelGroup>{children}</PanelGroup>
}

