'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ConfigPanelProps {
  selectedNode: string | null
  selectedNodeData?: any
}

export function ConfigPanel({ selectedNode, selectedNodeData }: ConfigPanelProps) {
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
        <div className="p-4">
          <h2 className="text-lg font-semibold">Configuration</h2>
          <Separator className="mt-3" />
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center space-y-2">
            <div className="text-sm">Select an endpoint to configure</div>
            <div className="text-xs">Drag an endpoint from the left panel to the canvas</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Configuration</h2>
        {selectedNodeData ? (
          <div className="mt-2 space-y-1">
            <div className="text-sm font-medium">{selectedNodeData.name}</div>
            <div className="text-xs text-muted-foreground">
              {selectedNodeData.method} {selectedNodeData.path}
            </div>
            <div className="text-xs text-muted-foreground">{selectedNodeData.description}</div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mt-1">
            Node: {selectedNode || 'None selected'}
          </div>
        )}
        <Separator className="mt-3" />
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-4">
          {/* Request Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={config.timeout}
                  onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retries">Retry Attempts</Label>
                <Input
                  id="retries"
                  type="number"
                  value={config.retries}
                  onChange={(e) => setConfig(prev => ({ ...prev, retries: parseInt(e.target.value) }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Headers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Headers</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                + Add Header
              </Button>
            </CardContent>
          </Card>

          {/* Query Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Query Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                + Add Parameter
              </Button>
            </CardContent>
          </Card>

          {/* Request Body */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Body</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="Enter JSON request body..."
                value={config.requestBody}
                onChange={(e) => setConfig(prev => ({ ...prev, requestBody: e.target.value }))}
                rows={6}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Response Mapping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Response Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                + Add Mapping
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        <Separator className="mb-4" />
        <Button className="w-full">
          Save Configuration
        </Button>
        <Button variant="outline" className="w-full">
          Reset to Default
        </Button>
      </div>
    </div>
  )
}