import { UpdateBlockPayload } from "@/hooks/useUpdateCommonBlockFields";
import apiClient from "@/lib/apiClient";

export async function updateBlockField(id: string, data: UpdateBlockPayload) {
  const res = await apiClient.patch(`/blocks/${id}`, data);
  return res.data;
}

export async function createStatementBlock(data: any) {
  const res = await apiClient.post("/blocks", data);
  return res.data;
}

export async function getBlockById(id: string) {
  const res = await apiClient.get(`/blocks/${id}`);
  return res.data;
}
