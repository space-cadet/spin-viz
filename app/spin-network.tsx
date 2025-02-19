"use client"

import React, { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Line } from "@react-three/drei"
import * as THREE from "three"

type Node = {
  id: string
  position: [number, number, number]
}

type Edge = {
  source: string
  target: string
  label: string
}

const nodes: Node[] = [
  { id: "A", position: [0, 0, 0] },
  { id: "B", position: [1, 0, 0] },
  { id: "C", position: [0, 1, 0] },
  { id: "D", position: [1, 1, 0] },
]

const edges: Edge[] = [
  { source: "A", target: "B", label: "AB" },
  { source: "A", target: "C", label: "AC" },
  { source: "B", target: "C", label: "BC" },
  { source: "C", target: "D", label: "CD" },
]

export function SpinNetwork() {
  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>()
    nodes.forEach((node) => map.set(node.id, node))
    return map
  }, [])

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Render nodes */}
        {nodes.map((node) => (
          <mesh key={node.id} position={new THREE.Vector3(...node.position)}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        ))}

        {/* Render edges and labels */}
        {edges.map((edge, index) => {
          const sourceNode = nodeMap.get(edge.source)
          const targetNode = nodeMap.get(edge.target)

          if (!sourceNode || !targetNode) return null

          const start = new THREE.Vector3(...sourceNode.position)
          const end = new THREE.Vector3(...targetNode.position)
          const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

          return (
            <React.Fragment key={index}>
              <Line points={[start, end]} color="black" lineWidth={1} />
              <Text position={mid} fontSize={0.2} color="red" anchorX="center" anchorY="middle">
                {edge.label}
              </Text>
            </React.Fragment>
          )
        })}

        <OrbitControls />
      </Canvas>
    </div>
  )
}