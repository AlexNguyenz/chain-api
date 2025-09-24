'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ConfigPanelProps {
  selectedNode: string | null
}

export function ConfigPanel({ selectedNode }: ConfigPanelProps) {
  const [config, setConfig] = useState({
    timeout: 30000,
    retries: 3,
    headers: {},
    queryParams: {},
    requestBody: '',
    responseMapping: {}
  })

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-sm">Select an endpoint to configure</div>
            <div className="text-xs mt-1">Drag an endpoint from the left panel to the canvas</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
        <div className="text-sm text-gray-600 mt-1">Node: {selectedNode}</div>
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-6">
        {/* Request Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Request Settings</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeout (ms)
            </label>
            <input
              type="number"
              value={config.timeout}
              onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retry Attempts
            </label>
            <input
              type="number"
              value={config.retries}
              onChange={(e) => setConfig(prev => ({ ...prev, retries: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Headers */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Headers</h3>
          <div>
            <button className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              + Add Header
            </button>
          </div>
        </div>

        {/* Query Parameters */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Query Parameters</h3>
          <div>
            <button className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              + Add Parameter
            </button>
          </div>
        </div>

        {/* Request Body */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Request Body</h3>
          <textarea
            value={config.requestBody}
            onChange={(e) => setConfig(prev => ({ ...prev, requestBody: e.target.value }))}
            placeholder="Enter JSON request body..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Response Mapping */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Response Mapping</h3>
          <div>
            <button className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              + Add Mapping
            </button>
          </div>
        </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Save Configuration
        </button>
        <button className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Reset to Default
        </button>
      </div>
    </div>
  )
}