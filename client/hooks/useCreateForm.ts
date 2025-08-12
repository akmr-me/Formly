import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateForm } from "@/services/form";

type UpdateFormPayload = {
  id: string;
  title?: string;
  buttonText?: string;
};

export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFormPayload) => updateForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}
