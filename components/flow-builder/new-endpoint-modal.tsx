'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEndpointStore, type Endpoint } from '@/store/endpoints'

interface NewEndpointModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editEndpoint?: Endpoint | null
}

export function NewEndpointModal({ open, onOpenChange, editEndpoint }: NewEndpointModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET' as 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: '',
    description: ''
  })

  const addEndpoint = useEndpointStore((state) => state.addEndpoint)
  const updateEndpoint = useEndpointStore((state) => state.updateEndpoint)

  // Reset form when modal opens/closes or editEndpoint changes
  useEffect(() => {
    if (open && editEndpoint) {
      // Edit mode - populate form with existing data
      setFormData({
        name: editEndpoint.name,
        method: editEndpoint.method,
        path: editEndpoint.path,
        description: editEndpoint.description
      })
    } else if (open) {
      // Create mode - reset to empty form
      setFormData({
        name: '',
        method: 'GET',
        path: '',
        description: ''
      })
    }
  }, [open, editEndpoint])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.path.trim()) {
      alert('Name and Path are required!')
      return
    }

    if (editEndpoint) {
      // Edit mode - update existing endpoint
      updateEndpoint(editEndpoint.id, {
        name: formData.name.trim(),
        method: formData.method,
        path: formData.path.trim(),
        description: formData.description.trim()
      })
    } else {
      // Create mode - add new endpoint
      addEndpoint({
        name: formData.name.trim(),
        method: formData.method,
        path: formData.path.trim(),
        description: formData.description.trim()
      })
    }

    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      method: 'GET',
      path: '',
      description: ''
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editEndpoint ? 'Edit Endpoint' : 'Create New Endpoint'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Get Users"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Method</Label>
            <Select
              value={formData.method}
              onValueChange={(value: 'GET' | 'POST' | 'PUT' | 'DELETE') =>
                setFormData(prev => ({ ...prev, method: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Path *</Label>
            <Input
              id="path"
              placeholder="e.g., /api/users"
              value={formData.path}
              onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this endpoint..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editEndpoint ? 'Update Endpoint' : 'Create Endpoint'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}