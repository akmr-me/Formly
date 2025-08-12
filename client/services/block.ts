// src/services/formService.ts
import apiClient from "@/lib/apiClient";

export async function createStatementBlock(data: any) {
  const res = await apiClient.post("/blocks", data);
  return res.data;
}

export async function getBlockById(id: string) {
  const res = await apiClient.get(`/blocks/${id}`);
  return res.data;
}
