# API Endpoint Creation Feature - Manual Creation System

## Tổng quan dự án hiện tại

### Công nghệ sử dụng
- **Framework**: Next.js 15.5.4 với App Router
- **Frontend**: React 19.1.0 với TypeScript
- **Styling**: Tailwind CSS v4 với shadcn/ui components
- **Icons**: Lucide React
- **HTTP Client**: Axios cho API requests
- **Data Fetching**: React Query (TanStack Query) cho API state management
- **Form Management**: React Hook Form cho endpoint form state
- **Global State**: Zustand cho global endpoint management
- **Deployment**: Next.js với Turbopack

### Cấu trúc dự án
```
chain-api/
├── app/
│   ├── layout.tsx          # Root layout với font configuration
│   └── page.tsx            # Homepage với landing sections
├── components/
│   ├── ui/                 # shadcn/ui base components
│   └── sections/           # Landing page sections
│       ├── hero.tsx
│       ├── problem-statement.tsx
│       ├── solution-overview.tsx
│       ├── key-features.tsx
│       └── cta.tsx
```

## Phân tích các giải pháp quản lý API Endpoint

### 1. Postman (Tiêu chuẩn ngành)

#### Tính năng chính 2025
- **AI Integration**: Postbot AI assistant cho việc viết test scripts và tạo tests
- **API Builder**: Thiết kế API với standardized patterns
- **Visual Workflow**: Postman Flows - low-code editor cho API workflows
- **Collection Management**: Organize, run và share API collections
- **Real-time Collaboration**: Team workspace với version control

#### Workflow tạo endpoint thủ công
1. **Request Builder Interface**:
   - Method selector (GET, POST, PUT, DELETE, etc.)
   - URL input với parameter support
   - Headers management (key-value pairs)
   - Body editor (JSON, Form-data, Raw, etc.)
   - Query parameters section
   - Authorization configuration

2. **Testing & Validation**:
   - Pre-request scripts
   - Test scripts với assertions
   - Environment variables
   - Response visualization

3. **Documentation Generation**:
   - Auto-generated docs từ requests
   - Example responses
   - Parameter descriptions

### 2. Các alternatives phổ biến

#### Apidog
- OpenAPI 3.0 compliance
- Visual document management
- Database operations support
- Unified platform approach

#### Insomnia
- Design-first approach
- Native Git sync
- GraphQL support mạnh
- Lightweight interface

#### Hoppscotch
- Web-based, open-source
- Privacy-focused với local storage
- Support REST, GraphQL, WebSocket
- Self-hosting options

## Thiết kế hệ thống tạo Endpoint thủ công

### 1. Architecture Overview

```typescript
// Core Types
interface ApiEndpoint {
  id: string
  name: string
  method: HttpMethod
  url: string
  description?: string
  headers: Record<string, string>
  queryParams: Record<string, string>
  body?: {
    type: 'json' | 'form-data' | 'raw' | 'none'
    content: string | Record<string, any>
  }
  auth?: {
    type: 'none' | 'bearer' | 'basic' | 'api-key'
    config: Record<string, string>
  }
  createdAt: Date
  updatedAt: Date
}
```

### 2. Component Architecture

#### 2.1 Main Components Structure
```typescript
// 1. EndpointBuilder - Main container
components/
├── endpoint-builder/
│   ├── EndpointBuilder.tsx          # Main wrapper component
│   ├── RequestPanel.tsx             # Left panel - Request configuration
│   ├── ResponsePanel.tsx            # Right panel - Response & testing
│   ├── ConfigurationTabs.tsx        # Tabs for different config sections
│   └── components/
│       ├── MethodSelector.tsx       # HTTP method dropdown
│       ├── UrlInput.tsx             # URL input với validation
│       ├── HeadersEditor.tsx        # Key-value editor cho headers
│       ├── QueryParamsEditor.tsx    # Query parameters editor
│       ├── BodyEditor.tsx           # Body content editor
│       ├── AuthConfigEditor.tsx     # Authentication configuration
│       └── ResponseViewer.tsx       # Response display & analysis
```

#### 2.2 RequestPanel Detail Design
```typescript
// RequestPanel.tsx
interface RequestPanelProps {
  endpoint: ApiEndpoint
  onEndpointChange: (endpoint: Partial<ApiEndpoint>) => void
  onSendRequest: () => Promise<void>
  loading: boolean
}

const RequestPanel: React.FC<RequestPanelProps> = ({
  endpoint,
  onEndpointChange,
  onSendRequest,
  loading
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header với Method + URL */}
      <div className="flex gap-2 p-4 border-b">
        <MethodSelector
          value={endpoint.method}
          onChange={(method) => onEndpointChange({ method })}
        />
        <UrlInput
          value={endpoint.url}
          onChange={(url) => onEndpointChange({ url })}
          placeholder="https://api.example.com/endpoint"
        />
        <Button
          onClick={onSendRequest}
          loading={loading}
          variant="default"
        >
          Send
        </Button>
      </div>

      {/* Configuration Tabs */}
      <ConfigurationTabs
        endpoint={endpoint}
        onEndpointChange={onEndpointChange}
      />
    </div>
  )
}
```

#### 2.3 Configuration Tabs Implementation
```typescript
// ConfigurationTabs.tsx
const ConfigurationTabs: React.FC<ConfigurationTabsProps> = ({
  endpoint,
  onEndpointChange
}) => {
  const [activeTab, setActiveTab] = useState('params')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="params">Params</TabsTrigger>
        <TabsTrigger value="headers">Headers</TabsTrigger>
        <TabsTrigger value="body">Body</TabsTrigger>
        <TabsTrigger value="auth">Auth</TabsTrigger>
      </TabsList>

      <TabsContent value="params">
        <QueryParamsEditor
          params={endpoint.queryParams}
          onChange={(queryParams) => onEndpointChange({ queryParams })}
        />
      </TabsContent>

      <TabsContent value="headers">
        <HeadersEditor
          headers={endpoint.headers}
          onChange={(headers) => onEndpointChange({ headers })}
        />
      </TabsContent>

      <TabsContent value="body">
        <BodyEditor
          body={endpoint.body}
          onChange={(body) => onEndpointChange({ body })}
        />
      </TabsContent>

      <TabsContent value="auth">
        <AuthConfigEditor
          auth={endpoint.auth}
          onChange={(auth) => onEndpointChange({ auth })}
        />
      </TabsContent>
    </Tabs>
  )
}
```

### 3. Key-Value Editors Pattern

#### 3.1 HeadersEditor Implementation
```typescript
// components/endpoint-builder/components/HeadersEditor.tsx
interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

const HeadersEditor: React.FC<HeadersEditorProps> = ({ headers, onChange }) => {
  const [pairs, setPairs] = useState<KeyValuePair[]>(() =>
    Object.entries(headers).map(([key, value], index) => ({
      id: `header-${index}`,
      key,
      value,
      enabled: true
    }))
  )

  const addNewPair = () => {
    setPairs([...pairs, {
      id: `header-${Date.now()}`,
      key: '',
      value: '',
      enabled: true
    }])
  }

  const updatePair = (id: string, updates: Partial<KeyValuePair>) => {
    setPairs(pairs.map(pair =>
      pair.id === id ? { ...pair, ...updates } : pair
    ))
  }

  const removePair = (id: string) => {
    setPairs(pairs.filter(pair => pair.id !== id))
  }

  useEffect(() => {
    const activeHeaders = pairs
      .filter(pair => pair.enabled && pair.key)
      .reduce((acc, pair) => ({ ...acc, [pair.key]: pair.value }), {})
    onChange(activeHeaders)
  }, [pairs, onChange])

  return (
    <div className="space-y-2">
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2">
          <Checkbox
            checked={pair.enabled}
            onCheckedChange={(enabled) => updatePair(pair.id, { enabled: !!enabled })}
          />
          <Input
            placeholder="Header name"
            value={pair.key}
            onChange={(e) => updatePair(pair.id, { key: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="Header value"
            value={pair.value}
            onChange={(e) => updatePair(pair.id, { value: e.target.value })}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePair(pair.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={addNewPair}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Header
      </Button>
    </div>
  )
}
```

### 4. Body Editor với Multiple Types

```typescript
// components/endpoint-builder/components/BodyEditor.tsx
type BodyType = 'none' | 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw'

const BodyEditor: React.FC<BodyEditorProps> = ({ body, onChange }) => {
  const [bodyType, setBodyType] = useState<BodyType>(body?.type || 'none')
  const [content, setContent] = useState(body?.content || '')

  const handleTypeChange = (type: BodyType) => {
    setBodyType(type)
    setContent('')
    onChange({ type, content: type === 'none' ? undefined : '' })
  }

  return (
    <div className="space-y-4">
      <Select value={bodyType} onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select body type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="form-data">Form Data</SelectItem>
          <SelectItem value="x-www-form-urlencoded">x-www-form-urlencoded</SelectItem>
          <SelectItem value="raw">Raw</SelectItem>
        </SelectContent>
      </Select>

      {bodyType === 'json' && (
        <div className="space-y-2">
          <Label>JSON Content</Label>
          <Textarea
            value={typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setContent(parsed)
                onChange({ type: bodyType, content: parsed })
              } catch {
                setContent(e.target.value)
                onChange({ type: bodyType, content: e.target.value })
              }
            }}
            placeholder='{\n  "key": "value"\n}'
            className="font-mono min-h-[200px]"
          />
        </div>
      )}

      {bodyType === 'form-data' && (
        <FormDataEditor
          data={content as Record<string, string>}
          onChange={(data) => {
            setContent(data)
            onChange({ type: bodyType, content: data })
          }}
        />
      )}

      {bodyType === 'raw' && (
        <div className="space-y-2">
          <Label>Raw Content</Label>
          <Textarea
            value={content as string}
            onChange={(e) => {
              setContent(e.target.value)
              onChange({ type: bodyType, content: e.target.value })
            }}
            placeholder="Enter raw content..."
            className="font-mono min-h-[200px]"
          />
        </div>
      )}
    </div>
  )
}
```

### 5. Response Panel

#### 5.1 ResponseViewer Component
```typescript
// components/endpoint-builder/components/ResponseViewer.tsx
interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  responseTime: number
  size: number
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  loading,
  error
}) => {
  const [activeTab, setActiveTab] = useState('body')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Sending request...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        <span>{error.message}</span>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <span>Click "Send" to see the response</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Status và Metrics */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-4">
          <Badge
            variant={response.status < 400 ? "default" : "destructive"}
          >
            {response.status} {response.statusText}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {response.responseTime}ms
          </span>
          <span className="text-sm text-muted-foreground">
            {formatBytes(response.size)}
          </span>
        </div>
      </div>

      {/* Response Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="body">
          <JSONViewer
            data={response.data}
            collapsible={true}
            theme="light"
          />
        </TabsContent>

        <TabsContent value="headers">
          <div className="space-y-1">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-4 py-1 text-sm">
                <span className="font-medium">{key}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 6. API Management với Axios + React Query

#### 6.1 Axios Configuration
```typescript
// lib/api-client.ts
import axios from 'axios'
import { ApiEndpoint } from '@/types/endpoint'

export const createApiClient = (endpoint: ApiEndpoint) => {
  return axios.create({
    baseURL: new URL(endpoint.url).origin,
    timeout: 30000,
    headers: endpoint.headers
  })
}

export const executeRequest = async (endpoint: ApiEndpoint) => {
  const client = createApiClient(endpoint)
  const url = new URL(endpoint.url)

  const config = {
    method: endpoint.method,
    url: url.pathname + url.search,
    params: endpoint.queryParams,
    data: endpoint.body?.content,
    headers: endpoint.headers
  }

  // Handle authentication
  if (endpoint.auth?.type === 'bearer') {
    config.headers.Authorization = `Bearer ${endpoint.auth.config.token}`
  } else if (endpoint.auth?.type === 'api-key') {
    config.headers[endpoint.auth.config.keyName] = endpoint.auth.config.keyValue
  }

  return client.request(config)
}
```

#### 6.2 React Query Integration
```typescript
// hooks/use-endpoint-request.ts
import { useMutation } from '@tanstack/react-query'
import { executeRequest } from '@/lib/api-client'
import { ApiEndpoint, ApiResponse } from '@/types/endpoint'

export const useEndpointRequest = () => {
  return useMutation({
    mutationFn: async (endpoint: ApiEndpoint): Promise<ApiResponse> => {
      const startTime = Date.now()

      try {
        const response = await executeRequest(endpoint)
        const endTime = Date.now()

        return {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          responseTime: endTime - startTime,
          size: JSON.stringify(response.data).length
        }
      } catch (error: any) {
        const endTime = Date.now()

        if (error.response) {
          return {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data,
            responseTime: endTime - startTime,
            size: JSON.stringify(error.response.data || {}).length
          }
        }
        throw error
      }
    },
    onSuccess: (data, variables) => {
      // Log successful request
      console.log('Request completed:', {
        endpoint: variables.name,
        status: data.status,
        responseTime: data.responseTime
      })
    }
  })
}
```

### 7. Form Management với React Hook Form

#### 7.1 Endpoint Form Hook
```typescript
// hooks/use-endpoint-form.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ApiEndpoint } from '@/types/endpoint'

const endpointSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  url: z.string().url('Invalid URL'),
  description: z.string().optional(),
  headers: z.record(z.string()).default({}),
  queryParams: z.record(z.string()).default({}),
  body: z.object({
    type: z.enum(['json', 'form-data', 'raw', 'none']),
    content: z.any().optional()
  }).optional(),
  auth: z.object({
    type: z.enum(['none', 'bearer', 'basic', 'api-key']),
    config: z.record(z.string())
  }).optional()
})

export type EndpointFormData = z.infer<typeof endpointSchema>

export const useEndpointForm = (initialData?: Partial<ApiEndpoint>) => {
  return useForm<EndpointFormData>({
    resolver: zodResolver(endpointSchema),
    defaultValues: {
      name: initialData?.name || '',
      method: initialData?.method || 'GET',
      url: initialData?.url || '',
      description: initialData?.description || '',
      headers: initialData?.headers || {},
      queryParams: initialData?.queryParams || {},
      body: initialData?.body || { type: 'none' },
      auth: initialData?.auth || { type: 'none', config: {} }
    }
  })
}
```

#### 7.2 Form Component Integration
```typescript
// components/endpoint-builder/EndpointForm.tsx
import { useEndpointForm } from '@/hooks/use-endpoint-form'
import { useEndpointStore } from '@/store/endpoint-store'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'

const EndpointForm: React.FC<{ endpoint?: ApiEndpoint }> = ({ endpoint }) => {
  const form = useEndpointForm(endpoint)
  const { saveEndpoint } = useEndpointStore()

  const onSubmit = (data: EndpointFormData) => {
    const endpointData: ApiEndpoint = {
      id: endpoint?.id || crypto.randomUUID(),
      ...data,
      createdAt: endpoint?.createdAt || new Date(),
      updatedAt: new Date()
    }

    saveEndpoint(endpointData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint Name</FormLabel>
              <FormControl>
                <Input placeholder="My API Endpoint" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HTTP Method</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://api.example.com/endpoint" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

### 8. Global State Management với Zustand

```typescript
// store/endpoint-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EndpointStore {
  endpoints: ApiEndpoint[]
  currentEndpoint: ApiEndpoint | null

  // Actions
  loadEndpoints: () => void
  saveEndpoint: (endpoint: ApiEndpoint) => void
  deleteEndpoint: (id: string) => void
  setCurrentEndpoint: (endpoint: ApiEndpoint | null) => void
  duplicateEndpoint: (id: string) => void
  importEndpoints: (endpoints: ApiEndpoint[]) => void
  exportEndpoints: () => ApiEndpoint[]
}

export const useEndpointStore = create<EndpointStore>()(
  persist(
    (set, get) => ({
      endpoints: [],
      currentEndpoint: null,

      loadEndpoints: () => {
        // Data already loaded via persist middleware
      },

      saveEndpoint: (endpoint) => {
        const { endpoints } = get()
        const existingIndex = endpoints.findIndex(e => e.id === endpoint.id)

        let updatedEndpoints
        if (existingIndex >= 0) {
          updatedEndpoints = endpoints.map((e, i) =>
            i === existingIndex ? { ...endpoint, updatedAt: new Date() } : e
          )
        } else {
          updatedEndpoints = [...endpoints, {
            ...endpoint,
            createdAt: new Date(),
            updatedAt: new Date()
          }]
        }

        set({ endpoints: updatedEndpoints })
      },

      deleteEndpoint: (id) => {
        const { endpoints } = get()
        const updatedEndpoints = endpoints.filter(e => e.id !== id)
        set({ endpoints: updatedEndpoints })
      },

      setCurrentEndpoint: (endpoint) => {
        set({ currentEndpoint: endpoint })
      },

      duplicateEndpoint: (id) => {
        const { endpoints } = get()
        const endpoint = endpoints.find(e => e.id === id)
        if (endpoint) {
          const duplicated = {
            ...endpoint,
            id: crypto.randomUUID(),
            name: `${endpoint.name} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          set({ endpoints: [...endpoints, duplicated] })
        }
      },

      importEndpoints: (importedEndpoints) => {
        const { endpoints } = get()
        const newEndpoints = importedEndpoints.map(ep => ({
          ...ep,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
        set({ endpoints: [...endpoints, ...newEndpoints] })
      },

      exportEndpoints: () => {
        return get().endpoints
      }
    }),
    {
      name: 'chain-api-endpoints',
      partialize: (state) => ({
        endpoints: state.endpoints,
        currentEndpoint: state.currentEndpoint
      })
    }
  )
)
```

## Kế hoạch Implementation

### Phase 1: Core Setup & Dependencies (Week 1)
1. **Dependencies Installation**
   ```bash
   npm install axios @tanstack/react-query react-hook-form @hookform/resolvers
   npm install zod zustand @types/axios
   ```

2. **Setup cơ bản**
   - Tạo folder structure cho endpoint-builder
   - Setup shadcn/ui components cần thiết (Tabs, Select, Input, Button, Form, etc.)
   - Tạo basic types và interfaces
   - Cấu hình React Query Provider

3. **State Management Setup**
   - Zustand store với persist middleware
   - React Hook Form hooks
   - Axios client configuration

### Phase 2: Core Components (Week 2-3)
1. **RequestPanel Implementation**
   - MethodSelector component
   - UrlInput với validation
   - Basic ConfigurationTabs structure với React Hook Form

2. **Key-Value Editors với Form Integration**
   - HeadersEditor với useFieldArray
   - QueryParamsEditor với validation
   - Form validation và error handling

3. **Body Editor**
   - Multiple body types support
   - JSON editor với syntax highlighting
   - Form-data editor với React Hook Form

### Phase 3: API Integration & Testing (Week 3-4)
1. **Axios + React Query Integration**
   - API client setup
   - Request execution logic
   - Error handling và retry logic

2. **ResponseViewer**
   - Status display
   - JSON response viewer với React Query data
   - Headers display
   - Response metrics và caching

3. **Authentication**
   - Basic auth, Bearer token, API key support
   - Auth configuration UI với Form validation

### Phase 4: Advanced Features (Week 4)
1. **Enhanced State Management**
   - Import/Export functionality
   - Duplicate endpoints
   - Advanced Zustand actions

2. **UI/UX Improvements**
   - Loading states với React Query
   - Error handling toasts
   - Responsive design
   - Keyboard shortcuts

3. **Form Enhancements**
   - Real-time validation
   - Auto-save drafts
   - Form reset và clear functionality

## Tổng kết

Hệ thống tạo endpoint thủ công này sẽ cung cấp:

### ✅ **Tính năng chính**
- **Manual endpoint creation** với giao diện trực quan
- **Multi-format body support** (JSON, Form-data, Raw)
- **Headers & query parameters management** với React Hook Form validation
- **Authentication configuration** (Bearer, API Key, Basic Auth)
- **Response viewing & analysis** với React Query caching
- **Real-time form validation** với Zod schema
- **Global state management** với Zustand persistence
- **Import/Export** functionality cho endpoint collections

### 🎯 **Ưu điểm so với Postman**
- **Web-based**: Không cần cài đặt app
- **Type-safe**: Full TypeScript support với Zod validation
- **Tích hợp**: Phù hợp với Chain API workflow
- **Performance**: React Query caching và optimization
- **Developer Experience**: React Hook Form + shadcn/ui
- **Customizable**: Có thể tùy chỉnh theo nhu cầu riêng
- **Lightweight**: Focus vào manual creation, không phức tạp

### 🔧 **Technical Stack được cập nhật**
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **HTTP Client**: Axios cho reliable API requests
- **Data Fetching**: React Query (TanStack Query) cho caching & state
- **Form Management**: React Hook Form + Zod validation
- **Global State**: Zustand với persist middleware
- **Storage**: LocalStorage với automatic persistence

Hệ thống này sẽ cung cấp trải nghiệm tương tự Postman nhưng được tối ưu cho việc tạo endpoint thủ công và tích hợp tốt với Chain API platform.