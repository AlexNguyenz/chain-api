import { Node, Edge } from '@xyflow/react';

export interface ExecutionContext {
  variables: Record<string, any>;
  stepResults: Record<string, any>;
  currentData: any;
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: string;
  data: any;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface ExecutionResult {
  success: boolean;
  steps: ExecutionStep[];
  finalResult?: any;
  error?: string;
  executionTime: number;
}

export interface ExecutionCallbacks {
  onNodeStart?: (nodeId: string) => void;
  onNodeComplete?: (nodeId: string) => void;
  onNodeError?: (nodeId: string, error: string) => void;
}

export class APIChainExecutor {
  private nodes: Node[];
  private edges: Edge[];
  private context: ExecutionContext;
  private steps: ExecutionStep[];
  private callbacks?: ExecutionCallbacks;

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.context = {
      variables: {},
      stepResults: {},
      currentData: null
    };
    this.steps = [];
  }

  /**
   * Thực thi với callbacks để update UI
   */
  async executeWithCallbacks(callbacks: ExecutionCallbacks, initialData?: any): Promise<ExecutionResult> {
    this.callbacks = callbacks;
    return this.execute(initialData);
  }

  /**
   * Thực thi toàn bộ API chain
   */
  async execute(initialData?: any): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Reset context
      this.context.currentData = initialData || null;
      this.steps = [];

      // Tìm node Start
      const startNode = this.nodes.find(node =>
        node.type === 'flowControl' && node.data.type === 'start'
      );

      if (!startNode) {
        throw new Error('No Start node found in the flow');
      }

      // Bắt đầu execution từ Start node
      await this.executeFromNode(startNode.id);

      // Tính thời gian thực thi
      const executionTime = Date.now() - startTime;

      return {
        success: true,
        steps: this.steps,
        finalResult: this.context.currentData,
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        steps: this.steps,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime
      };
    }
  }

  /**
   * Thực thi từ một node cụ thể
   */
  private async executeFromNode(nodeId: string): Promise<void> {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    try {
      // Bắt đầu node
      this.callbacks?.onNodeStart?.(nodeId);

      // Thực thi node
      if (node.type === 'endpoint') {
        await this.executeEndpoint(node);
      } else if (node.type === 'flowControl') {
        await this.executeFlowControl(node);
      }

      // Chỉ gọi complete khi không có lỗi
      this.callbacks?.onNodeComplete?.(nodeId);

    } catch (error) {
      this.callbacks?.onNodeError?.(nodeId, error instanceof Error ? error.message : 'Unknown error');
    }

    // Luôn tiếp tục với node tiếp theo (dù success hay error)
    const nextEdge = this.edges.find(edge => edge.source === nodeId);
    if (nextEdge) {
      await this.executeFromNode(nextEdge.target);
    }
  }

  /**
   * Tiếp tục đến node tiếp theo trong chain
   */
  private async continueToNextNode(node: Node): Promise<void> {
    if (node.type === 'endpoint') {
      // Với endpoint, chỉ tiếp tục với node tiếp theo
      const nextEdge = this.edges.find(edge => edge.source === node.id);
      if (nextEdge) {
        await this.executeFromNode(nextEdge.target);
      }
    }
    // Flow control nodes sẽ tự xử lý logic tiếp theo
  }

  /**
   * Thực thi Flow Control node
   */
  private async executeFlowControl(node: Node): Promise<void> {
    const { type } = node.data;

    switch (type) {
      case 'start':
        // Start node chỉ cần chuyển sang node tiếp theo
        break;

      case 'end':
        // End node kết thúc execution
        return;

      case 'delay':
        // Delay node tạm dừng execution
        const delayMs = (node.data.delayMs as number) || 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        break;

      case 'condition':
        // Chỉ là placeholder
        break;

      case 'loop':
        // Chỉ là placeholder
        break;
    }
  }

  /**
   * Thực thi API Endpoint node
   */
  private async executeEndpoint(node: Node): Promise<void> {
    const { method, path } = node.data;

    // Thực hiện API call thật
    const response = await this.makeAPICall(method as string, path as string, {});
    this.context.currentData = response.data;
  }

  /**
   * Chuẩn bị configuration cho API request
   */
  private prepareRequestConfig(node: Node): any {
    const config: any = {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };

    // Sử dụng dữ liệu hiện tại làm request body
    if (this.context.currentData) {
      config.data = this.context.currentData;
    }

    // Thêm headers tùy chỉnh nếu có
    if (node.data.headers) {
      config.headers = { ...config.headers, ...node.data.headers };
    }

    return config;
  }

  /**
   * Thực hiện API call
   */
  private async makeAPICall(method: string, path: string, config: any): Promise<any> {
    const url = this.buildFullURL(path);

    const fetchConfig: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      signal: AbortSignal.timeout(config.timeout || 30000)
    };

    // Thêm body cho POST, PUT, PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && config.data) {
      fetchConfig.body = JSON.stringify(config.data);
    }

    const response = await fetch(url, fetchConfig);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  }

  /**
   * Xây dựng full URL
   */
  private buildFullURL(path: string): string {
    // Nếu path đã là full URL thì return luôn
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Nếu không có base URL thì sử dụng relative path
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    return `${baseURL}${path}`;
  }

  /**
   * Đánh giá điều kiện logic
   */
  private evaluateCondition(condition: string): boolean {
    if (!condition) return true;

    try {
      // Thay thế variables trong condition
      const processedCondition = condition.replace(/\$\{([^}]+)\}/g, (match, varName) => {
        const value = this.getVariableValue(varName);
        return JSON.stringify(value);
      });

      // Đánh giá expression (cần cẩn thận với security)
      return new Function('return ' + processedCondition)();
    } catch {
      return false;
    }
  }


  /**
   * Lấy giá trị variable từ context
   */
  private getVariableValue(varName: string): any {
    // Kiểm tra trong variables
    if (this.context.variables[varName] !== undefined) {
      return this.context.variables[varName];
    }

    // Kiểm tra trong step results
    const parts = varName.split('.');
    if (parts.length === 2) {
      const [stepId, fieldName] = parts;
      const stepResult = this.context.stepResults[stepId];
      return stepResult?.data?.[fieldName];
    }

    // Kiểm tra current data
    if (varName === 'currentData') {
      return this.context.currentData;
    }

    return undefined;
  }
}