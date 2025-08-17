import { useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilderHeader from "../organisms/FormBuilderHeader";
import { useParams } from "next/navigation";
import { PublishStatusType } from "@/types";
import { publishForm } from "@/services/form";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRightFromSquare } from "lucide-react";

export default function FormBuilderHeaderContainer() {
  const params = useParams();
  const formId = params.formId as string;
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["forms", formId, "blocks"],
    enabled: false,
    initialData: () => queryClient.getQueryData(["forms", formId, "blocks"]),
  });

  const formData = data?.data;
  const [isPublishing, setIsPublishing] = useState(false);
  console.log("formData", formData);
  const handlePublishForm = () => {
    setIsPublishing(true);
    console.log("handle pulist form trigger");
    publishForm(formId)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["forms", formId, "blocks"],
        });
        toast.success("Form is published successfully!", {
          description() {
            return (
              <a
                href={`${window.origin}/form/${formId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline flex"
              >
                View form <ArrowUpRightFromSquare fontSize={16} />
              </a>
            );
          },
        });
      })
      .finally(() => setIsPublishing(false));
  };
  console.log({ formData, data });
  // if (!formData) return null;
  return (
    <FormBuilderHeader
      onPublish={handlePublishForm}
      formStatus={formData?.status as PublishStatusType}
      isPublishing={isPublishing}
      formUrl={`${window.origin}/form/${formId}`}
    />
  );
}
