import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageLayoutOptions } from "@/constants";
import { UseMutateFunction } from "@tanstack/react-query";
import { UpdateBlockPayload } from "@/hooks/useUpdateCommonBlockFields";
import { CoverImageLayout } from "@/types";
import { Label } from "@/components/ui/label";

type ImageLayoutProps = {
  mutate: UseMutateFunction<any, Error, Partial<UpdateBlockPayload>, unknown>;
  coverImageLayout?: CoverImageLayout;
};

export function ImageLayout({ mutate, coverImageLayout }: ImageLayoutProps) {
  const currentValue = coverImageLayout || ImageLayoutOptions[0]?.value;

  const handleValueChange = (value: CoverImageLayout) => {
    if (value !== currentValue) {
      mutate({ coverImageLayout: value });
    }
  };

  return (
    <>
      <Label className="mb-1">Layout</Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ImageLayoutOptions.map((option, index) => (
            <SelectItem
              key={option.value}
              value={option.value}
              // TODO: What split does
              disabled={index == 1}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
