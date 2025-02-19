"use client"

import React, { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Line } from "@react-three/drei"
import * as THREE from "three"

// Define the Node type
type Node = {
  id: number
  position: [number, number, number]
}

// Define the Edge type
type Edge = {
  source: number
  target: number
  label: string
}

// Function to create a random SU(2) representation label
const randomSU2Label = () => {
  const j = Math.floor(Math.random() * 4) / 2 // 0, 1/2, 1, 3/2
  return j === 0 ? "0" : `${j}`
}

const SpinNetwork: React.FC = () => {
  // Create nodes and edges for the spin network
  const nodes: Node[] = useMemo(
    () => [
      { id: 0, position: [-1, 1, 0] },
      { id: 1, position: [1, 1, 0] },
      { id: 2, position: [-1, -1, 0] },
      { id: 3, position: [1, -1, 0] },
    ],
    [],
  )

  const edges: Edge[] = useMemo(
    () => [
      { source: 0, target: 1, label: randomSU2Label() },
      { source: 0, target: 2, label: randomSU2Label() },
      { source: 1, target: 3, label: randomSU2Label() },
      { source: 2, target: 3, label: randomSU2Label() },
      { source: 0, target: 3, label: randomSU2Label() },
    ],
    [],
  )

  return (
    <div className="w-full h-screen">
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
          const start = new THREE.Vector3(...nodes[edge.source].position)
          const end = new THREE.Vector3(...nodes[edge.target].position)
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

export default SpinNetwork

