import { UpdateBlockPayload } from "@/hooks/useUpdateCommonBlockFields";
import apiClient from "@/lib/apiClient";
import { DefaultBlockDataType } from "@/types";

export async function updateBlockField(id: string, data: UpdateBlockPayload) {
  const res = await apiClient.patch(`/blocks/${id}`, data);
  return res.data;
}

export async function createNewBlock(data: DefaultBlockDataType) {
  const res = await apiClient.post("/blocks", data);
  return res.data;
}

export async function getBlockById(id: string) {
  const res = await apiClient.get(`/blocks/${id}`);
  return res.data;
}

export async function duplicateBlock(id: string) {
  const res = await apiClient.post(`/blocks/${id}/duplicate`);
  return res.data;
}

export async function deleteBlock(id: string) {
  const res = await apiClient.delete(`/blocks/${id}`);
  return res.data;
}
