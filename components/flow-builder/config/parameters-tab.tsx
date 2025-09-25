"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PathVariables } from "./path-variables";
import { QueryParameters } from "./query-parameters";
import { type Variable } from "@/store/templates";

interface PathVariable {
  key: string;
  value: string;
  description?: string;
  enabled: boolean;
}

interface QueryParameter {
  key: string;
  value: string;
  description?: string;
  enabled: boolean;
}

interface ParametersTabProps {
  pathParams: PathVariable[];
  queryParams: QueryParameter[];
  variables: Variable[];
  onAddPathParam: () => void;
  onRemovePathParam: (index: number) => void;
  onUpdatePathParam: (index: number, field: string, value: string | boolean) => void;
  onAddQueryParam: () => void;
  onRemoveQueryParam: (index: number) => void;
  onUpdateQueryParam: (index: number, field: string, value: string | boolean) => void;
}

export function ParametersTab({
  pathParams,
  queryParams,
  variables,
  onAddPathParam,
  onRemovePathParam,
  onUpdatePathParam,
  onAddQueryParam,
  onRemoveQueryParam,
  onUpdateQueryParam,
}: ParametersTabProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <PathVariables
          pathParams={pathParams}
          variables={variables}
          onAdd={onAddPathParam}
          onRemove={onRemovePathParam}
          onUpdate={onUpdatePathParam}
        />

        <QueryParameters
          queryParams={queryParams}
          variables={variables}
          onAdd={onAddQueryParam}
          onRemove={onRemoveQueryParam}
          onUpdate={onUpdateQueryParam}
        />
      </div>
    </ScrollArea>
  );
}