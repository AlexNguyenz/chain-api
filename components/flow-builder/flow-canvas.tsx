'use client'

import { useCallback, useState, useRef } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  OnConnect,
  ReactFlowProvider,
  ReactFlowInstance
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { EndpointNode } from './endpoint-node'
import { type Endpoint } from '@/store/endpoints'

const nodeTypes = {
  endpoint: EndpointNode,
}

interface FlowCanvasProps {
  onNodeSelect: (nodeId: string | null, nodeData?: Endpoint | null) => void
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export function FlowCanvas({ onNodeSelect }: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return
      }

      try {
        const dropData = JSON.parse(type)
        if (dropData.type === 'endpoint') {
          const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })

          const nodeId = `endpoint-${dropData.data.id}-${Date.now()}`
          const newNode: Node = {
            id: nodeId,
            type: 'endpoint',
            position,
            data: {
              ...dropData.data,
              onSelect: () => onNodeSelect(nodeId)
            },
          }

          setNodes((nds) => nds.concat(newNode))
        }
      } catch (error) {
        console.error('Error parsing drop data:', error)
      }
    },
    [reactFlowInstance, setNodes, onNodeSelect]
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id, node.data as unknown as Endpoint)
    },
    [onNodeSelect]
  )

  const onPaneClick = useCallback(() => {
    onNodeSelect(null, null)
  }, [onNodeSelect])

  return (
    <div className="h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export function FlowCanvasWrapper(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  )
}