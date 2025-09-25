"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Endpoint } from "@/store/endpoints";
import {
  useTemplateStore,
  type Variable,
  type EndpointConfig,
} from "@/store/templates";
import { ConfigHeader } from "./config/config-header";
import { ParametersTab } from "./config/parameters-tab";
import { HeadersTab } from "./config/headers-tab";
import { VariablesTab } from "./config/variables-tab";
import { ActionButtons } from "./config/action-buttons";

interface ConfigPanelProps {
  selectedNode: string | null;
  selectedNodeData?: Endpoint | null;
}

export function ConfigPanel({
  selectedNode,
  selectedNodeData,
}: ConfigPanelProps) {
  const {
    selectedTemplate,
    updateEndpointConfig,
    addVariable,
    deleteVariable,
  } = useTemplateStore();


  const [newVariable, setNewVariable] = useState<Variable>({
    name: "",
    value: "",
    description: "",
  });

  const [pathParams, setPathParams] = useState<
    Array<{
      key: string;
      value: string;
      description?: string;
      enabled: boolean;
    }>
  >([]);

  const [queryParams, setQueryParams] = useState<
    Array<{
      key: string;
      value: string;
      description?: string;
      enabled: boolean;
    }>
  >([]);

  const [headers, setHeaders] = useState<
    Array<{
      key: string;
      value: string;
      description?: string;
      enabled: boolean;
    }>
  >([]);

  const variables = selectedTemplate?.variables || [];

  // Path parameter functions
  const addPathParam = () => {
    setPathParams((prev) => [
      ...prev,
      {
        key: "",
        value: "",
        description: "",
        enabled: true,
      },
    ]);
  };

  const removePathParam = (index: number) => {
    setPathParams((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePathParam = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setPathParams((prev) =>
      prev.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      )
    );
  };

  // Load saved config when node changes
  React.useEffect(() => {
    if (selectedNode && selectedTemplate) {
      // Get saved config from template
      const savedConfig = selectedTemplate?.endpointConfigs?.[selectedNode];

      // Load saved path parameters
      if (savedConfig?.pathVariables) {
        const pathParams = Object.entries(savedConfig.pathVariables).map(
          ([key, value]) => ({
            key,
            value: value as string,
            description: "",
            enabled: true,
          })
        );
        setPathParams(pathParams);
      } else {
        setPathParams([]);
      }

      // Load saved query parameters
      if (savedConfig?.queryParameters) {
        setQueryParams(savedConfig.queryParameters);
      } else {
        setQueryParams([]);
      }

      // Load saved headers
      if (savedConfig?.headers) {
        setHeaders(savedConfig.headers);
      } else {
        setHeaders([]);
      }
    } else {
      // Clear when no node selected
      setPathParams([]);
      setQueryParams([]);
      setHeaders([]);
    }
  }, [selectedNode, selectedTemplate]);

  // Query parameter functions
  const addQueryParam = () => {
    setQueryParams((prev) => [
      ...prev,
      {
        key: "",
        value: "",
        description: "",
        enabled: true,
      },
    ]);
  };

  const removeQueryParam = (index: number) => {
    setQueryParams((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQueryParam = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setQueryParams((prev) =>
      prev.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      )
    );
  };

  // Header functions
  const addHeader = () => {
    setHeaders((prev) => [
      ...prev,
      {
        key: "",
        value: "",
        description: "",
        enabled: true,
      },
    ]);
  };

  const removeHeader = (index: number) => {
    setHeaders((prev) => prev.filter((_, i) => i !== index));
  };

  const updateHeader = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setHeaders((prev) =>
      prev.map((header, i) =>
        i === index ? { ...header, [field]: value } : header
      )
    );
  };

  // Save configuration to template
  const handleSave = () => {
    if (!selectedTemplate || !selectedNode) return;

    const configToSave: EndpointConfig = {
      baseUrl: "",
      pathVariables: pathParams.reduce(
        (acc, param) => ({
          ...acc,
          [param.key]: param.value,
        }),
        {}
      ),
      queryParameters: queryParams.map((param) => ({
        key: param.key,
        value: param.value,
        enabled: param.enabled,
        description: param.description,
      })),
      headers: headers.map((header) => ({
        key: header.key,
        value: header.value,
        enabled: header.enabled,
        description: header.description,
      })),
      authorization: undefined,
      body: { type: "raw", content: "" },
    };

    updateEndpointConfig(selectedTemplate.id, selectedNode, configToSave);
  };

  // Reset configuration
  const handleReset = () => {
    if (!selectedTemplate || !selectedNode) return;

    if (
      confirm(
        "Are you sure you want to reset all configuration for this endpoint?"
      )
    ) {
      // Reset path parameters (keep keys, clear values)
      setPathParams((prev) =>
        prev.map((param) => ({
          ...param,
          value: "",
          description: "",
          enabled: true,
        }))
      );

      // Clear query parameters
      setQueryParams([]);

      // Clear headers
      setHeaders([]);

      // Remove from template store
      updateEndpointConfig(selectedTemplate.id, selectedNode, {
        baseUrl: "",
        pathVariables: {},
        queryParameters: [],
        headers: [],
        authorization: undefined,
        body: { type: "raw", content: "" },
      });
    }
  };

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <ConfigHeader
          selectedNode={selectedNode}
          selectedNodeData={selectedNodeData}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ConfigHeader
        selectedNode={selectedNode}
        selectedNodeData={selectedNodeData}
      />

      <Tabs
        defaultValue="request"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-4 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
          </TabsList>
        </div>

        {/* Request Tab */}
        <TabsContent value="request" className="flex-1 overflow-hidden mt-0">
          <Tabs defaultValue="parameters" className="h-full flex flex-col">
            <div className="px-4 pt-4 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="authorization">Authorization</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="parameters"
              className="flex-1 overflow-hidden mt-0"
            >
              <ParametersTab
                pathParams={pathParams}
                queryParams={queryParams}
                variables={variables}
                onAddPathParam={addPathParam}
                onRemovePathParam={removePathParam}
                onUpdatePathParam={updatePathParam}
                onAddQueryParam={addQueryParam}
                onRemoveQueryParam={removeQueryParam}
                onUpdateQueryParam={updateQueryParam}
              />
            </TabsContent>

            <TabsContent
              value="headers"
              className="flex-1 overflow-hidden mt-0"
            >
              <HeadersTab
                headers={headers}
                variables={variables}
                onAddHeader={addHeader}
                onRemoveHeader={removeHeader}
                onUpdateHeader={updateHeader}
              />
            </TabsContent>

            <TabsContent
              value="authorization"
              className="flex-1 overflow-hidden mt-0"
            >
              <div className="p-4 text-sm text-muted-foreground">
                Authorization configuration will be implemented here
              </div>
            </TabsContent>

            <TabsContent value="body" className="flex-1 overflow-hidden mt-0">
              <div className="p-4 text-sm text-muted-foreground">
                Body configuration will be implemented here
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Variables Tab */}
        <TabsContent value="variables" className="flex-1 overflow-hidden mt-0">
          <VariablesTab
            variables={variables}
            newVariable={newVariable}
            onNewVariableChange={setNewVariable}
            onAddVariable={() => {
              if (newVariable.name && newVariable.value && selectedTemplate) {
                addVariable(selectedTemplate.id, newVariable);
                setNewVariable({
                  name: "",
                  value: "",
                  description: "",
                });
              }
            }}
            onDeleteVariable={(name) => {
              if (selectedTemplate) {
                deleteVariable(selectedTemplate.id, name);
              }
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Fixed position action buttons */}
      <div className="border-t bg-background">
        <ActionButtons
          onSave={handleSave}
          onReset={handleReset}
          disabled={!selectedTemplate || !selectedNode}
        />
      </div>
    </div>
  );
}
