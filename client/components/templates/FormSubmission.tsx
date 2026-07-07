"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { FormlyFormLocalStorageKey } from "@/constants";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddressBlockContainer from "../containers/blocks/custom/AddressBlockContainer";

type SubmissionStatus = "saved" | "submitted";

type FormValue = FormDataEntryValue | FormValue[] | FormValues;

interface SubmissionData {
  value: FormValue;
  status: SubmissionStatus;
}

type FormStorage = {
  [formId: string]: {
    submission_id: string;
    submitted_at: string;
    submissions: {
      [inputName: string]: SubmissionData;
    };
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

export default function FormSubmission() {
  const params = useParams();
  const formId = params.formId as string;
  const [isSumbitting, setIsSubmitting] = useState(false);
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
  console.log({ response, form });
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

  const submitResponse = useCallback(async () => {
    const submissionId = storageValue[formId].submission_id;
    if (!submissionId) {
      toast.error("No submission id found.");
      return;
    }
    const submissions = storageValue[formId];
    const response = await apiClient.post(
      "/forms/" + formId + "/response/" + submissionId,
      submissions
    );
    console.log({ response });
    if (response.status === 201) {
      toast.success("Form submitted successfully.");
      setStorageValue((prevStorage) => {
        const clone = structuredClone(prevStorage);
        delete clone[formId];
        return clone;
      });
      // e?.target?.reset();
      console.log({ inputRef });
      if (inputRef.current) inputRef.current.value = "";
    }
    setIsSubmitting(false);
    console.log("response", response);
  }, [formId, setStorageValue, storageValue]);

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
    console.log("values", values);
    if (
      Object.keys(values).length &&
      values[InputName] &&
      (Array.isArray(values[InputName])
        ? values[InputName].filter(Boolean).length
        : Boolean(values[InputName]))
    ) {
      let submissionId = storageValue[formId]?.submission_id;
      console.log("storageValue", storageValue);
      console.log({ values });

      if (!submissionId) {
        const response = await createNewFormResponse(formId);
        console.log({ response });
        submissionId = response.data.id;
        const submittedAt = response.data.submittedAt;

        setStorageValue((prev) => {
          const prevFormData = prev[formId] || {};
          return {
            ...prev,
            [formId]: {
              ...prevFormData,
              submission_id: submissionId!,
              submitted_at: submittedAt,
              submissions: {
                ...prevFormData.submissions,
                [InputName]: {
                  value: values[InputName],
                  status: "saved",
                },
              },
            },
          };
        });
      } else {
        setStorageValue((prevStorage) => ({
          ...prevStorage,
          [formId]: {
            ...prevStorage[formId],
            submissions: {
              ...prevStorage[formId]?.submissions,
              [InputName]: {
                value: values[InputName],
                status: "saved",
              },
            },
          },
        }));
      }
    }

    if (!isLastPage) handleClickDown();
    // may need time waiting
    else setIsSubmitting(true);
  }

  const handleClickUp = () => setPage((prevPage) => prevPage - 1);
  const handleClickDown = () => setPage((prevPage) => prevPage + 1);

  useEffect(() => {
    if (isSumbitting) submitResponse();
  }, [isSumbitting, submitResponse]);

  if (isLoading || isError) {
    return error ? JSON.stringify(error) : null;
  }

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
      : { backgroundColor: "#b59a94" };

  const InputName = selectedBlockData.id;
  console.log({ InputName, selectedBlockData });
  const isLastPage = page === data.totalPages;

  const values = storageValue[formId]?.submissions?.[InputName]?.value || "";
  console.log("values", storageValue, storageValue[formId], values);
  return (
    <FormSubmissionLayout
      currentStep={page}
      totalSteps={data.totalPages}
      showNavigation={page > 1}
      onDownClick={handleClickDown}
      onUpClick={handleClickUp}
      formStatus={form?.status}
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

  switch (selectedBlockData.type) {
    case "statement":
      return <StatementDisplayContainer selectedBlockData={selectedBlockData} />;
    case "shortText":
      return (
        <TextInput
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          ref={inputRef}
        />
      );
    case "longText":
      return (
        <LongText
          name={inputName}
          required={required}
          defaultValue={defaultValue}
        />
      );
    case "number":
      return (
        <NumberInput
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          ref={inputRef}
        />
      );
    case "websiteUrl":
      return (
        <URLInput
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          ref={inputRef}
        />
      );
    case "date":
      return (
        <DateInput
          name={inputName}
          required={required}
          defaultValue={defaultValue}
          ref={inputRef}
        />
      );
    case "address":
      return (
        <AddressBlockContainer
          selectedBlockData={selectedBlockData}
          defaultValue={getAddressDefaultValue(value)}
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
