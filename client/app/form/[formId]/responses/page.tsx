"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFormResponses } from "@/services/form";
import { FormResponseAnswer, FormResponsesData } from "@/types";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";

export default function FormResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, router, user]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["forms", formId, "responses"],
    queryFn: () => getFormResponses(formId),
    enabled: !!formId && !!user,
  });

  const responseData = data?.data;
  const hasResponses = Boolean(responseData?.responses.length);

  function handleDownloadCsv() {
    if (!responseData || responseData.responses.length === 0) return;

    const csv = buildResponsesCsv(responseData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `form-${formId}-responses.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (isAuthLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Checking your session...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/form/${formId}/build`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900">
                Form Responses
              </h1>
              <p className="truncate text-sm text-gray-500">
                View and export submitted answers for form {formId}.
              </p>
            </div>
          </div>

          <Button
            className="w-full md:w-auto"
            onClick={handleDownloadCsv}
            disabled={!hasResponses}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {isLoading && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
            Loading responses...
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load responses.
          </div>
        )}

        {!isLoading && !isError && responseData && (
          <ResponsesTable responseData={responseData} />
        )}
      </div>
    </main>
  );
}

function ResponsesTable({
  responseData,
}: {
  responseData: FormResponsesData;
}) {
  if (responseData.responses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <h2 className="text-lg font-medium text-gray-900">No responses yet</h2>
        <p className="mt-2 text-sm text-gray-500">
          Submitted form responses will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-medium text-gray-900">
          {responseData.responses.length} submitted response
          {responseData.responses.length === 1 ? "" : "s"}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600">
                Submitted At
              </th>
              {responseData.blocks.map((block) => (
                <th
                  key={block.id}
                  className="min-w-48 px-4 py-3 text-left font-medium text-gray-600"
                >
                  {block.title || "Untitled block"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {responseData.responses.map((response) => (
              <tr key={response.id}>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {formatDateTime(response.submittedAt)}
                </td>
                {responseData.blocks.map((block) => (
                  <td
                    key={`${response.id}-${block.id}`}
                    className="max-w-80 break-words px-4 py-3 text-gray-700"
                  >
                    {formatAnswer(response.answers[block.id]) || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function buildResponsesCsv(responseData: FormResponsesData) {
  const headers = [
    "Response ID",
    "Submitted At",
    ...responseData.blocks.map((block) => block.title || "Untitled block"),
  ];

  const rows = responseData.responses.map((response) => [
    response.id,
    formatDateTime(response.submittedAt),
    ...responseData.blocks.map((block) =>
      formatAnswer(response.answers[block.id])
    ),
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatAnswer(answer?: FormResponseAnswer) {
  if (!answer?.value) return "";

  try {
    const parsed = JSON.parse(answer.value);

    if (Array.isArray(parsed)) {
      return parsed.map(formatParsedValue).filter(Boolean).join(", ");
    }

    return formatParsedValue(parsed);
  } catch {
    return answer.value;
  }
}

function formatParsedValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(formatParsedValue).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("value" in record) return formatParsedValue(record.value);

    return Object.entries(record)
      .filter(([, fieldValue]) => fieldValue !== "")
      .map(([fieldKey, fieldValue]) => `${fieldKey}: ${formatParsedValue(fieldValue)}`)
      .join(", ");
  }

  return String(value);
}
