'use client'

import { Plus, File } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const handleNewEndpoint = () => {
    console.log('Create new endpoint')
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
    </header>
  )
}