import { useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilderHeader from "../organisms/FormBuilderHeader";
import { useParams, useRouter } from "next/navigation";
import { PublishStatusType } from "@/types";
import { getFormWithBlocks, publishForm } from "@/services/form";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRightFromSquare } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import EmbedCodeModal from "@/components/molecules/EmbedCodeModal";

export default function FormBuilderHeaderContainer() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { data } = useQuery({
    queryKey: ["forms", formId, "blocks"],
    queryFn: () => getFormWithBlocks(formId),
    enabled: !!formId,
    initialData: () => queryClient.getQueryData(["forms", formId, "blocks"]),
  });

  const formData = data?.data;
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const handlePublishForm = () => {
    setIsPublishing(true);
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
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      <FormBuilderHeader
        onPublish={handlePublishForm}
        formStatus={formData?.status as PublishStatusType}
        isPublishing={isPublishing}
        formUrl={`${window.origin}/form/${formId}`}
        responsesUrl={`/form/${formId}/responses`}
        formId={formId}
        canEmbed={formData?.status === "publish"}
        onOpenEmbed={() => setIsEmbedModalOpen(true)}
        onLogout={handleLogout}
      />
      <EmbedCodeModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        formId={formId}
      />
    </>
  );
}
