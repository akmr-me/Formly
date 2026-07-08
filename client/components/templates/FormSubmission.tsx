"use client";

import { useParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import BlockDisplayLayout from "../organisms/display/BlockDisplayLayout";
import FormSubmissionLayout from "../organisms/FormSubmissionLayout";
import StatementDisplayContainer from "../containers/display/StatementDisplayContainer";
import {
  createNewFormResponse,
  getFormById,
  getPaginatedPublishedBlocks,
} from "@/services/form";
import { BlockType } from "@/types";
import FormNotPublishedMessage from "./FormNotPublishedMessage";
import {
  DateInput,
  LongText,
  NumberInput,
  TextInput,
  URLInput,
} from "../molecules/block/InputBlock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FormlyFormLocalStorageKey, FormSurfaceColor } from "@/constants";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddressBlockContainer from "../containers/blocks/custom/AddressBlockContainer";
import SelectBlock from "../molecules/block/SelectBlock";
import { getBlockInputConstraints } from "@/lib/blockConstraints";

type SubmissionStatus = "saved" | "submitted";

type FormValue = FormDataEntryValue | FormValue[] | FormValues;

interface SubmissionData {
  value: FormValue;
  status: SubmissionStatus;
}

type FormStorage = {
  [formId: string]: FormSubmissionState;
};

type FormSubmissionState = {
  submission_id: string;
  submitted_at: string;
  submissions: {
    [inputName: string]: SubmissionData;
  };
};

type FormValues = {
  [key: string]: FormValue;
};

type PaginatedBlocksResponse = {
  blocks: BlockType;
  totalCount: number;
  totalPages: number;
};

export default function FormSubmission({ isEmbed = false }: { isEmbed?: boolean }) {
  const params = useParams();
  const formId = params.formId as string;
  const [isSumbitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [storageValue, setStorageValue] = useLocalStorage(
    FormlyFormLocalStorageKey,
    { [formId]: {} } as FormStorage
  );
  const [page, setPage] = useState(1);

  const { data: response } = useQuery({
    queryKey: ["forms", formId],
    queryFn: () => getFormById(formId),
    enabled: !!formId,
  });

  const form = response?.data;
  const { data, isLoading, isError, error } = useQuery<PaginatedBlocksResponse>(
    {
      queryKey: ["forms", formId, "published-blocks", page],
      queryFn: async () => {
        const res = await getPaginatedPublishedBlocks(formId, page, 1);
        return res.data;
      },
      placeholderData: keepPreviousData,
    }
  );

  const submitResponse = useCallback(
    async (submission: FormSubmissionState) => {
      const submissionId = submission.submission_id;
      if (!submissionId) {
        toast.error("No submission id found.");
        setIsSubmitting(false);
        return;
      }

      const response = await apiClient.post(
        "/forms/" + formId + "/response/" + submissionId,
        submission
      );

      if (response.status === 201) {
        setStorageValue((prevStorage) => {
          const clone = structuredClone(prevStorage);
          delete clone[formId];
          return clone;
        });
        setIsSubmitted(true);
        if (isEmbed && window.parent !== window) {
          window.parent.postMessage(
            { type: "formly:submitted", formId },
            "*"
          );
        }
        toast.success("Form submitted successfully.");
        if (inputRef.current) inputRef.current.value = "";
      }
      setIsSubmitting(false);
    },
    [formId, isEmbed, setStorageValue]
  );

  async function handleNextOrSubmitButtonClicked(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const form =
      (e.target as HTMLButtonElement).form ||
      (e.currentTarget as HTMLFormElement);

    if (!form) {
      console.error("No form found for submission.");
      return;
    }

    const formData = new FormData(form);
    const values: FormValues = {};

    formData.forEach((value, key) => {
      appendFormValue(values, key, value);
    });
    let updatedSubmission = storageValue[formId];

    if (
      Object.keys(values).length &&
      values[InputName] &&
      (Array.isArray(values[InputName])
        ? values[InputName].filter(Boolean).length
        : Boolean(values[InputName]))
    ) {
      let submissionId = storageValue[formId]?.submission_id;

      if (!submissionId) {
        const response = await createNewFormResponse(formId);
        submissionId = response.data.id;
        const submittedAt = response.data.submittedAt;
        updatedSubmission = {
          ...(storageValue[formId] || {}),
          submission_id: submissionId!,
          submitted_at: submittedAt,
          submissions: {
            ...(storageValue[formId]?.submissions || {}),
            [InputName]: {
              value: values[InputName],
              status: "saved",
            },
          },
        };

        setStorageValue((prev) => {
          return {
            ...prev,
            [formId]: updatedSubmission,
          };
        });
      } else {
        updatedSubmission = {
          ...storageValue[formId],
          submissions: {
            ...storageValue[formId]?.submissions,
            [InputName]: {
              value: values[InputName],
              status: "saved",
            },
          },
        };

        setStorageValue((prevStorage) => ({
          ...prevStorage,
          [formId]: updatedSubmission,
        }));
      }
    }

    if (!isLastPage) handleClickDown();
    else {
      setIsSubmitting(true);
      await submitResponse(updatedSubmission);
    }
  }

  const handleClickUp = () => setPage((prevPage) => prevPage - 1);
  const handleClickDown = () => setPage((prevPage) => prevPage + 1);

  if (isLoading || isError) {
    return error ? JSON.stringify(error) : null;
  }

  // Show the form whenever a published version of the blocks exists. We rely
  // solely on the published-blocks query (above) — NOT on form.status — because
  // a form that's published but has newer unpublished edits has status "draft"
  // while still having a valid published version to serve. Embeds must keep
  // showing that published version instead of falsely reporting "not published".
  if (!data?.blocks) return <FormNotPublishedMessage />;

  const selectedBlockData = data.blocks;

  const coverImageUrl =
    (selectedBlockData.coverImageOrigin || "") +
    (selectedBlockData.coverImagePath || "");
  const coverImageLayout = selectedBlockData.coverImageLayout || "stack";

  const backgroundStyle =
    coverImageLayout === "wallpaper" && coverImageUrl
      ? {
          backgroundImage: `url("${encodeURI(coverImageUrl)}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : { backgroundColor: FormSurfaceColor };

  const InputName = selectedBlockData.id;
  const isLastPage = page === data.totalPages;

  const values = storageValue[formId]?.submissions?.[InputName]?.value || "";

  if (isSubmitted) {
    return (
      <SubmittedSuccessScreen formStatus={form?.status} isEmbed={isEmbed} />
    );
  }

  return (
    <FormSubmissionLayout
      currentStep={page}
      totalSteps={data.totalPages}
      showNavigation={page > 1}
      onDownClick={handleClickDown}
      onUpClick={handleClickUp}
      formStatus={isEmbed ? "publish" : form?.status}
      isEmbed={isEmbed}
    >
      <div
        className={cn(
          "flex-1 bg-gray-100 flex items-center justify-center mt-2 rounded-2xl p-4 flex-col overflow-y-auto scrollbar-hide",
          isSumbitting && "pointer-events-none opacity-45"
        )}
        style={backgroundStyle}
      >
        <form onSubmit={handleNextOrSubmitButtonClicked}>
          <BlockDisplayLayout
            title={selectedBlockData.title || ""}
            buttonText={
              (isLastPage ? "Submit" : selectedBlockData.buttonText) || ""
            }
            description={selectedBlockData.descriptionHtml || ""}
            textAlign={selectedBlockData.textAlign || "left"}
            imageUrl={coverImageUrl}
            imageLayout={coverImageLayout}
            // onButtonClick={handleNextOrSubmitButtonClicked}
            required={selectedBlockData.required}
          >
            {renderSubmissionBlock({
              selectedBlockData,
              inputName: InputName,
              required: selectedBlockData.required,
              value: values,
              inputRef,
            })}
          </BlockDisplayLayout>
        </form>
      </div>
    </FormSubmissionLayout>
  );
}

function SubmittedSuccessScreen({
  formStatus,
  isEmbed = false,
}: {
  formStatus?: "draft" | "publish";
  isEmbed?: boolean;
}) {
  return (
    <FormSubmissionLayout
      showProgress={false}
      showNavigation={false}
      formStatus={formStatus}
      isEmbed={isEmbed}
    >
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-950">
          Submitted successfully
        </h1>
        <p className="mt-3 max-w-md text-base text-gray-600">
          Thanks for your response. Your answers were saved and this form is now
          cleared on this device.
        </p>
      </div>
    </FormSubmissionLayout>
  );
}

function renderSubmissionBlock({
  selectedBlockData,
  inputName,
  required,
  value,
  inputRef,
}: {
  selectedBlockData: BlockType;
  inputName: string;
  required?: boolean;
  value: FormValue;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const defaultValue = getInputDefaultValue(value);
  const constraints = getBlockInputConstraints(
    selectedBlockData.type,
    selectedBlockData.optionalConfig
  );

  switch (selectedBlockData.type) {
    case "statement":
      return <StatementDisplayContainer selectedBlockData={selectedBlockData} />;
    case "shortText":
      return (
        <TextInput
          key={inputName}
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          placeholder={selectedBlockData.placeholder || undefined}
          ref={inputRef}
        />
      );
    case "longText":
      return (
        <LongText
          key={inputName}
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          placeholder={selectedBlockData.placeholder || undefined}
          minLength={constraints.minLength}
          maxLength={constraints.maxLength}
        />
      );
    case "number":
      return (
        <NumberInput
          key={inputName}
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          placeholder={selectedBlockData.placeholder || undefined}
          min={constraints.minNumber}
          max={constraints.maxNumber}
          ref={inputRef}
        />
      );
    case "websiteUrl":
      return (
        <URLInput
          key={inputName}
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          placeholder={selectedBlockData.placeholder || undefined}
          ref={inputRef}
        />
      );
    case "date":
      return (
        <DateInput
          key={inputName}
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          ref={inputRef}
        />
      );
    case "address":
      return (
        <AddressBlockContainer
          key={inputName}
          selectedBlockData={selectedBlockData}
          defaultValue={getAddressDefaultValue(value)}
        />
      );
    case "single":
    case "multi":
    case "dropdown":
      return (
        <SelectBlock
          key={inputName}
          selectedBlockData={selectedBlockData}
          name={inputName}
          required={required}
          defaultValue={getSelectDefaultValue(value)}
        />
      );
    default:
      return null;
  }
}

function appendFormValue(
  values: FormValues,
  dottedKey: string,
  value: FormDataEntryValue
) {
  const parts = dottedKey.split(".");
  let current = values;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const next = current[part];
    if (!isFormValues(next)) {
      current[part] = {};
      current = current[part] as FormValues;
    } else {
      current = next;
    }
  }

  const lastKey = parts[parts.length - 1];
  const existing = current[lastKey];

  if (existing === undefined) {
    current[lastKey] = value;
  } else if (Array.isArray(existing)) {
    current[lastKey] = [...existing, value];
  } else {
    current[lastKey] = [existing, value];
  }
}

function isFormValues(value: FormValue | undefined): value is FormValues {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof File)
  );
}

function getInputDefaultValue(value: FormValue) {
  return typeof value === "string" ? value : "";
}

function getSelectDefaultValue(value: FormValue) {
  if (typeof value === "string") return value;
  if (
    Array.isArray(value) &&
    value.every((item): item is string => typeof item === "string")
  ) {
    return value;
  }
  return "";
}

function getAddressDefaultValue(value: FormValue) {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof File)
  ) {
    return Object.fromEntries(
      Object.entries(value).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string"
      )
    );
  }

  return undefined;
}
