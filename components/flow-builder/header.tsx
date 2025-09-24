'use client'

import { Plus, File } from 'lucide-react'

export function Header() {
  const handleNewEndpoint = () => {
    console.log('Create new endpoint')
  }

  const handleNewTemplate = () => {
    console.log('Create new template')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">API Flow Builder</h1>
        <p className="text-sm text-gray-600">Design and configure your API workflows</p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleNewEndpoint}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>New Endpoint</span>
        </button>

        <button
          onClick={handleNewTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <File size={16} />
          <span>New Template</span>
        </button>
      </div>
    </header>
  )
}