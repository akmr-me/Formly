"use client";
import Link from "next/link";
import {
  BarChart3,
  ExternalLink,
  FileText,
  LogOut,
  Pencil,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { CreateFormLabel, CreateFormLoadingLabel } from "@/constants";
import { useCreateForm } from "@/hooks/useCreateForm";
import { useRouter } from "next/navigation";
import { useCreateStatementBlock } from "@/hooks/blocks/useCreateStatementBlock";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyForms } from "@/services/form";
import { OwnerFormSummary } from "@/types";

export default function Main() {
  const { mutate, isPending } = useCreateForm();
  const { mutate: mutateStatement } = useCreateStatementBlock();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  const { data: formsData, isLoading: isFormsLoading } = useQuery({
    queryKey: ["forms", "mine"],
    queryFn: getMyForms,
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  const handleCreate = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        const formShortId = res.data.shortId;
        toast.success("Form created!");

        mutateStatement(
          { shortId: formShortId },
          {
            onSuccess: (blockRes) => {
              queryClient.invalidateQueries({ queryKey: ["forms", "mine"] });
              router.push(
                `/form/${formShortId}/build?block_id=${blockRes.data.id}`
              );
            },
            onError: () => {
              toast.error("Failed to create first block");
            },
          }
        );
      },
      onError: () => {
        toast.error("Failed to create form");
      },
    });
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Checking your session...
      </div>
    );
  }

  const forms = formsData?.data ?? [];

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">Signed in as</p>
          <h1 className="mt-1 truncate text-2xl font-semibold text-gray-950">
            {user.email}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create forms, edit drafts, and review responses from one place.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button onClick={handleCreate} disabled={isPending}>
            <Plus className="h-4 w-4" />
            {isPending ? CreateFormLoadingLabel : CreateFormLabel}
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-950">Your Forms</h2>
            <p className="truncate text-sm text-gray-500">
              All forms owned by {user.email}.
            </p>
          </div>
          <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {forms.length} {forms.length === 1 ? "form" : "forms"}
          </span>
        </div>

        {isFormsLoading ? (
          <div className="p-6 text-sm text-gray-500">Loading forms...</div>
        ) : forms.length === 0 ? (
          <EmptyFormsState onCreate={handleCreate} isCreating={isPending} />
        ) : (
          <div className="divide-y divide-gray-100">
            {forms.map((form) => (
              <FormListRow key={form.id} form={form} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyFormsState({
  onCreate,
  isCreating,
}: {
  onCreate: () => void;
  isCreating: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="rounded-full bg-gray-100 p-4">
        <FileText className="h-8 w-8 text-gray-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-950">No forms yet</h3>
        <p className="mt-1 max-w-md text-sm text-gray-500">
          Create your first form and it will appear here with quick links to
          edit it or view responses.
        </p>
      </div>
      <Button onClick={onCreate} disabled={isCreating}>
        <Plus className="h-4 w-4" />
        {isCreating ? CreateFormLoadingLabel : CreateFormLabel}
      </Button>
    </div>
  );
}

function FormListRow({ form }: { form: OwnerFormSummary }) {
  const updatedAt = new Date(form.updatedAt).toLocaleString();
  const isPublished = form.status === "publish";

  return (
    <div className="flex flex-col gap-4 px-6 py-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-gray-950">Form {form.shortId}</h3>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
            {form.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">Updated {updatedAt}</p>
        <p className="mt-1 text-sm text-gray-500">
          {form.responseCount}{" "}
          {form.responseCount === 1 ? "response" : "responses"}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/form/${form.shortId}/build`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/form/${form.shortId}/responses`}>
            <BarChart3 className="h-4 w-4" />
            Responses
          </Link>
        </Button>
        {isPublished && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/form/${form.shortId}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Public
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
