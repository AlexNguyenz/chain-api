"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Variable {
  name: string;
  value: string;
  description?: string;
}

interface VariableInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  enableVariables?: boolean;
  variables?: Variable[];
  disabled?: boolean;
}

export function VariableInput({
  value = "",
  onChange,
  placeholder,
  className,
  enableVariables = true,
  variables = [],
  disabled = false,
}: VariableInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [filteredVariables, setFilteredVariables] = useState<Variable[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    onChange?.(newValue);
    setCursorPosition(cursorPos);

    // Check for {{ trigger if variables are enabled
    if (enableVariables && variables.length > 0) {
      const beforeCursor = newValue.slice(0, cursorPos);
      const match = beforeCursor.match(/\{\{([^}]*)$/);

      if (match) {
        const searchTerm = match[1].toLowerCase();
        const filtered = variables.filter((variable) =>
          variable.name.toLowerCase().includes(searchTerm)
        );
        setFilteredVariables(filtered);
        setShowSuggestions(true);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  // Handle key navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredVariables.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredVariables.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        selectVariable(filteredVariables[selectedIndex]);
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  // Select a variable from suggestions
  const selectVariable = (variable: Variable) => {
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);
    const match = beforeCursor.match(/\{\{([^}]*)$/);

    if (match) {
      const newValue =
        beforeCursor.slice(0, match.index) +
        `{{${variable.name}}}` +
        afterCursor;

      onChange?.(newValue);
      setShowSuggestions(false);

      // Set cursor position after the variable
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos =
            (match.index || 0) + `{{${variable.name}}}`.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />

      {showSuggestions && filteredVariables.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredVariables.map((variable, index) => (
            <div
              key={variable.name}
              className={cn(
                "px-3 py-2 cursor-pointer text-sm",
                index === selectedIndex
                  ? "bg-blue-50 text-blue-900"
                  : "hover:bg-gray-50"
              )}
              onClick={() => selectVariable(variable)}
            >
              <div className="font-medium">{`{{${variable.name}}}`}</div>
              {variable.description && (
                <div className="text-xs text-gray-500 truncate">
                  {variable.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
