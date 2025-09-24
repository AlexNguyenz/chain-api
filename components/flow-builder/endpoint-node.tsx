'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'

interface EndpointData {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  onSelect?: () => void
}

const methodColors = {
  GET: 'bg-green-500',
  POST: 'bg-blue-500',
  PUT: 'bg-yellow-500',
  DELETE: 'bg-red-500'
}

const methodTextColors = {
  GET: 'text-green-700',
  POST: 'text-blue-700',
  PUT: 'text-yellow-700',
  DELETE: 'text-red-700'
}

export const EndpointNode = memo(({ data, selected }: NodeProps) => {
  const endpointData = data as unknown as EndpointData
  return (
    <div className={`px-4 py-3 shadow-md rounded-lg bg-white border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-gray-400" />

      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-sm text-gray-900">{endpointData.name}</div>
        <div className={`px-2 py-1 rounded text-xs font-medium text-white ${methodColors[endpointData.method]}`}>
          {endpointData.method}
        </div>
      </div>

      <div className={`text-xs font-mono mb-2 ${methodTextColors[endpointData.method]}`}>
        {endpointData.path}
      </div>

      <div className="text-xs text-gray-600">
        {endpointData.description}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-gray-400" />
    </div>
  )
})

EndpointNode.displayName = 'EndpointNode'