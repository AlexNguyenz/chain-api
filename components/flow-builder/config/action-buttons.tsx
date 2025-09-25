"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  disabled: boolean;
}

export function ActionButtons({ onSave, onReset, disabled }: ActionButtonsProps) {
  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={disabled}
          className="min-w-20"
        >
          Reset
        </Button>
        <Button
          onClick={onSave}
          disabled={disabled}
          className="min-w-20"
        >
          Save
        </Button>
      </div>
    </div>
  );
}