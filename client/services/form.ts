import apiClient from "@/lib/apiClient";

export async function createForm() {
  const res = await apiClient.post("/forms", {});
  return res.data;
}

export async function getFormById(id: string) {
  const res = await apiClient.get(`/forms/${id}`);
  return res.data;
}

export async function getFormWithBlocks(formId: string) {
  const res = await apiClient.get(`/forms/${formId}/blocks`);
  return res.data;
}

export async function publishForm(formId: string) {
  const res = await apiClient.patch(`/forms/${formId}/publish`);
  return res.data;
}

export async function getPaginatedPublishedBlocks(
  formId: string,
  page: number,
  limit: number
) {
  const res = await apiClient.get(`/forms/${formId}/published-blocks`, {
    params: { page, limit },
  });
  return res.data;
}
