"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMethodColor, getStatusCodeColor } from "@/constants/color-methods";
import { HTTPMethod } from "@/constants/http-methods";

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: {
    method: string;
    path: string;
    name: string;
    requestData?: any;
    responseData?: any;
  };
}

export function RequestDetailsModal({
  isOpen,
  onClose,
  nodeData,
}: RequestDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger slide up animation
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-t-lg w-full max-w-4xl max-h-[80vh] transform transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("request")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === "request"
                ? "bg-gray-100 border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Request
          </button>
          <button
            onClick={() => setActiveTab("response")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === "response"
                ? "bg-gray-100 border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Response
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {/* Tab Content */}
          {activeTab === "request" && (
            <div>
              {/* Overview */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Overview
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={`text-xs font-bold justify-center rounded-sm w-16 h-6 ${getMethodColor(
                      nodeData.method as HTTPMethod
                    )}`}
                  >
                    {nodeData.method}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded font-mono">
                  {nodeData.path}
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Request Details
              </h3>
              <div className="bg-gray-50 p-3 rounded font-mono text-xs overflow-hidden">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(nodeData.requestData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "response" && (
            <div>
              {nodeData.responseData?.status && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Status
                  </h3>
                  <Badge
                    className={`text-xs font-bold justify-center rounded-sm w-16 h-6 ${getStatusCodeColor(
                      nodeData.responseData.status
                    )}`}
                  >
                    {nodeData.responseData.status}
                  </Badge>
                </div>
              )}

              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Response Data
              </h3>
              {nodeData.responseData ? (
                <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-hidden">
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(nodeData.responseData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  No response data available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
