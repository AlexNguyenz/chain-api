import { Node, Edge } from "@xyflow/react";
import { Template, EndpointConfig } from "@/store/templates";

export interface ExecutionContext {
  variables: Record<string, any>;
  stepResults: Record<string, any>;
  currentData: any;
}

export interface ExecutionStep {
  nodeId: string;
  nodeType: string;
  data: any;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
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
  onNodeComplete?: (
    nodeId: string,
    requestData?: any,
    responseData?: any
  ) => void;
  onNodeError?: (nodeId: string, error: string) => void;
}

export class APIChainExecutor {
  private nodes: Node[];
  private edges: Edge[];
  private context: ExecutionContext;
  private steps: ExecutionStep[];
  private callbacks?: ExecutionCallbacks;
  private template?: Template;
  private executorId: string;

  constructor(nodes: Node[], edges: Edge[], template?: Template) {
    this.executorId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.nodes = nodes;
    this.edges = edges;
    this.template = template;
    this.context = {
      variables: {},
      stepResults: {},
      currentData: null,
    };
    this.steps = [];

  }

  /**
   * Thực thi với callbacks để update UI
   */
  async executeWithCallbacks(
    callbacks: ExecutionCallbacks,
    initialData?: any
  ): Promise<ExecutionResult> {
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
      const startNode = this.nodes.find(
        (node) => node.type === "flowControl" && node.data.type === "start"
      );

      if (!startNode) {
        throw new Error("No Start node found in the flow");
      }

      // Bắt đầu execution từ Start node
      await this.executeFromNode(startNode.id);

      // Tính thời gian thực thi
      const executionTime = Date.now() - startTime;

      return {
        success: true,
        steps: this.steps,
        finalResult: this.context.currentData,
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        steps: this.steps,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime,
      };
    }
  }

  /**
   * Thực thi từ một node cụ thể
   */
  private async executeFromNode(nodeId: string): Promise<void> {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    let requestData: any = null;
    let responseData: any = null;

    try {
      // Bắt đầu node
      this.callbacks?.onNodeStart?.(nodeId);

      // Thực thi node
      if (node.type === "endpoint") {
        const result = await this.executeEndpoint(node);
        requestData = result.requestData;
        responseData = result.responseData;
      } else if (node.type === "flowControl") {
        await this.executeFlowControl(node);
      }

      // Chỉ gọi complete khi không có lỗi
      this.callbacks?.onNodeComplete?.(nodeId, requestData, responseData);
    } catch (error) {
      // Khi có lỗi, vẫn cần lưu requestData và error info
      if (node.type === "endpoint") {
        const { method, path } = node.data;
        const endpointConfig = this.template?.endpointConfigs?.[node.id];
        const processedPath = this.processPathVariables(
          path as string,
          endpointConfig
        );

        // Sử dụng dữ liệu riêng của node
        const nodeRequestBody = node.data.requestBody || null;

        requestData = {
          method,
          path: processedPath,
          originalPath: path,
          headers: { "Content-Type": "application/json" },
          body: nodeRequestBody,
          queryParameters: endpointConfig?.queryParameters || [],
          pathVariables: endpointConfig?.pathVariables || {},
        };

        responseData = {
          status: 500, // Default error status
          error: error instanceof Error ? error.message : "Unknown error",
          data: null,
        };

        // Chỉ gọi onNodeComplete để update UI với error data (không gọi onNodeError nữa)
        this.callbacks?.onNodeComplete?.(nodeId, requestData, responseData);
      } else {
        // Với non-endpoint nodes, chỉ gọi onNodeError
        this.callbacks?.onNodeError?.(
          nodeId,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    // Luôn tiếp tục với node tiếp theo (dù success hay error)
    const nextEdge = this.edges.find((edge) => edge.source === nodeId);
    if (nextEdge) {
      await this.executeFromNode(nextEdge.target);
    }
  }

  /**
   * Tiếp tục đến node tiếp theo trong chain
   */
  private async continueToNextNode(node: Node): Promise<void> {
    if (node.type === "endpoint") {
      // Với endpoint, chỉ tiếp tục với node tiếp theo
      const nextEdge = this.edges.find((edge) => edge.source === node.id);
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
      case "start":
        // Start node chỉ cần chuyển sang node tiếp theo
        break;

      case "end":
        // End node kết thúc execution
        return;

      case "delay":
        // Delay node tạm dừng execution
        const delayMs = (node.data.delayMs as number) || 1000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        break;

      case "condition":
        // Chỉ là placeholder
        break;

      case "loop":
        // Chỉ là placeholder
        break;
    }
  }

  /**
   * Thực thi API Endpoint node
   */
  private async executeEndpoint(
    node: Node
  ): Promise<{ requestData: any; responseData: any }> {
    const { method, path } = node.data;

    // Lấy endpoint config từ template
    const endpointConfig = this.template?.endpointConfigs?.[node.id];


    // Xử lý path variables để hiển thị đúng trong requestData
    const processedPath = this.processPathVariables(
      path as string,
      endpointConfig
    );

    // Mỗi endpoint sử dụng dữ liệu riêng của node, không share context
    const nodeRequestBody = node.data.requestBody || null;

    const requestData = {
      method,
      path: processedPath, // Hiển thị path đã xử lý
      originalPath: path, // Giữ lại path gốc
      headers: { "Content-Type": "application/json" },
      body: nodeRequestBody,
      queryParameters: endpointConfig?.queryParameters || [],
      pathVariables: endpointConfig?.pathVariables || {},
    };

    // Tạo config với data riêng của node
    const config = {
      data: nodeRequestBody,
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
      endpointConfig,
    };

    // Thực hiện API call thật
    const response = await this.makeAPICall(
      method as string,
      path as string,
      config
    );

    return {
      requestData,
      responseData: response,
    };
  }

  /**
   * Chuẩn bị configuration cho API request
   */
  private prepareRequestConfig(node: Node): any {
    const config: any = {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
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
  private async makeAPICall(
    method: string,
    path: string,
    config: any
  ): Promise<any> {
    const url = this.buildFullURL(path, config.endpointConfig);


    const fetchConfig: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      signal: AbortSignal.timeout(config.timeout || 30000),
    };

    // Thêm body cho POST, PUT, PATCH
    if (
      ["POST", "PUT", "PATCH"].includes(method.toUpperCase()) &&
      config.data
    ) {
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
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  /**
   * Xây dựng full URL
   */
  private buildFullURL(path: string, endpointConfig?: EndpointConfig): string {
    // Xử lý path variables trước
    const processedPath = this.processPathVariables(path, endpointConfig);

    // Nếu path đã là full URL thì return luôn
    if (
      processedPath.startsWith("http://") ||
      processedPath.startsWith("https://")
    ) {
      const finalURL = this.addQueryParameters(processedPath, endpointConfig);
      return finalURL;
    }

    // Nếu không có base URL thì sử dụng relative path
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const fullURL = `${baseURL}${processedPath}`;

    const finalURL = this.addQueryParameters(fullURL, endpointConfig);
    return finalURL;
  }

  /**
   * Xử lý path variables trong đường dẫn
   */
  private processPathVariables(
    path: string,
    endpointConfig?: EndpointConfig
  ): string {
    if (!endpointConfig?.pathVariables || !path) {
      return path;
    }

    let processedPath = path;

    // Xử lý từng path variable
    Object.entries(endpointConfig.pathVariables).forEach(([key, value]) => {
      if (key && value) {
        // Process variables in value (only {{key}} format)
        const processedValue = this.processVariables(value);

        // Replace the EXACT key as user typed (no auto-adding {{}})
        processedPath = processedPath.replaceAll(key, processedValue);
      }
    });

    return processedPath;
  }

  /**
   * Thêm query parameters vào URL
   */
  private addQueryParameters(
    url: string,
    endpointConfig?: EndpointConfig
  ): string {
    if (
      !endpointConfig?.queryParameters ||
      endpointConfig.queryParameters.length === 0
    ) {
      return url;
    }

    const enabledParams = endpointConfig.queryParameters.filter(
      (param) => param.enabled && param.key && param.value
    );

    if (enabledParams.length === 0) {
      return url;
    }

    const urlObj = new URL(url);

    enabledParams.forEach((param) => {
      // Xử lý variables trong value
      const processedValue = this.processVariables(param.value);
      urlObj.searchParams.set(param.key, processedValue);
    });

    return urlObj.toString();
  }

  /**
   * Xử lý variables trong string
   */
  private processVariables(value: string): string {
    if (!value) return value;

    // Only process {{variable}} format
    if (!value.includes("{{")) {
      return value;
    }

    // Process {{key}} format only
    const result = value.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      // Find variable where name === key
      const varValue = this.getVariableValue(key);

      if (varValue !== undefined) {
        const stringValue = String(varValue);
        return stringValue;
      } else {
        return match;
      }
    });

    return result;
  }

  /**
   * Đánh giá điều kiện logic
   */
  private evaluateCondition(condition: string): boolean {
    if (!condition) return true;

    try {
      // Thay thế variables trong condition
      const processedCondition = condition.replace(
        /\$\{([^}]+)\}/g,
        (_, varName) => {
          const value = this.getVariableValue(varName);
          return JSON.stringify(value);
        }
      );

      // Đánh giá expression (cần cẩn thận với security)
      return new Function("return " + processedCondition)();
    } catch {
      return false;
    }
  }

  /**
   * Lấy giá trị variable từ context
   */
  private getVariableValue(varName: string): any {
    // Kiểm tra trong template variables trước
    if (this.template?.variables) {
      const templateVar = this.template.variables.find(
        (v) => v.name === varName
      );
      if (templateVar) return templateVar.value;
    }

    // Kiểm tra trong context variables
    if (this.context.variables[varName] !== undefined) {
      return this.context.variables[varName];
    } 

    // Kiểm tra trong step results
    const parts = varName.split(".");
    if (parts.length === 2) {
      const [stepId, fieldName] = parts;
      const stepResult = this.context.stepResults[stepId];
      return stepResult?.data?.[fieldName];
    }

    // Kiểm tra current data
    if (varName === "currentData") {
      return this.context.currentData;
    }

    return undefined;
  }
}
