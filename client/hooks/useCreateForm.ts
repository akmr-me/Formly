import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createForm } from "@/services/form";

export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}
