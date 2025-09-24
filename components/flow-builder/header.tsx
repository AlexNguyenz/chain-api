'use client'

import React, { useState } from 'react'
import { Plus, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewEndpointModal } from './new-endpoint-modal'
import { type Endpoint } from '@/store/endpoints'

interface HeaderProps {
  editEndpoint?: Endpoint | null
  onEditEndpointChange?: (endpoint: Endpoint | null) => void
}

export function Header({ editEndpoint, onEditEndpointChange }: HeaderProps) {
  const [showEndpointModal, setShowEndpointModal] = useState(false)

  const handleNewEndpoint = () => {
    onEditEndpointChange?.(null) // Clear any existing edit
    setShowEndpointModal(true)
  }

  // Open modal when editEndpoint is set
  React.useEffect(() => {
    if (editEndpoint) {
      setShowEndpointModal(true)
    }
  }, [editEndpoint])

  const handleModalClose = (open: boolean) => {
    setShowEndpointModal(open)
    if (!open) {
      onEditEndpointChange?.(null) // Clear edit when modal closes
    }
  }

  const handleNewTemplate = () => {
    console.log('Create new template')
  }

  return (
    <header className="h-16 bg-background border-b flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold">API Flow Builder</h1>
        <p className="text-sm text-muted-foreground">Design and configure your API workflows</p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleNewEndpoint}>
          <Plus />
          New Endpoint
        </Button>

        <Button onClick={handleNewTemplate} variant="secondary">
          <File />
          New Template
        </Button>
      </div>

      <NewEndpointModal
        open={showEndpointModal}
        onOpenChange={handleModalClose}
        editEndpoint={editEndpoint}
      />
    </header>
  )
}