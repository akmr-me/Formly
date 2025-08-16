"use client";

import { useParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import BlockDisplayLayout from "../organisms/display/BlockDisplayLayout";
import FormSubmissionLayout from "../organisms/FormSubmissionLayout";
import StatementDisplayContainer from "../containers/display/StatementDisplayContainer";
import { getFormById, getPaginatedPublishedBlocks } from "@/services/form";
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
import { FermionFormLocalStorageKey } from "@/constants";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddressBlockContainer from "../containers/blocks/custom/AddressBlockContainer";

type SubmissionStatus = "saved" | "submitted";

interface SubmissionData {
  value: string | string[];
  status: SubmissionStatus;
}

interface FormStorage {
  [formId: string]: {
    submission_id: string;
    submitted_at: string;
    submissions: {
      [inputName: string]: SubmissionData;
    };
  };
}

interface FormValues {
  [key: string]: FormDataEntryValue | FormDataEntryValue[];
}

interface HandleSubmitParams {
  e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>;
  formId: string;
  inputName: string;
  storageValue: FormStorage;
  setStorage: React.Dispatch<React.SetStateAction<FormStorage>>;
  apiClient: {
    post: (
      url: string
    ) => Promise<{ data: { id: string; submittedAt: string } }>;
  };
  handleClickDown: () => void;
}

type PaginatedBlocksResponse = {
  blocks: BlockType;
  totalCount: number;
  totalPages: number;
};
// type FormValues = Record<string, any>;

// Map each block type to its corresponding React component
const BlockDisplayMap: Record<
  string,
  React.FC<{
    selectedBlockData: BlockType;
    name?: string;
    required?: boolean;
    defaultValue?: string;
    ref: RefObject<HTMLInputElement | null>;
  }>
> = {
  statement: StatementDisplayContainer,
  shortText: TextInput,
  longText: LongText,
  number: NumberInput,
  websiteUrl: URLInput,
  address: AddressBlockContainer,
  date: DateInput,
};

export default function FormSubmission() {
  const params = useParams();
  const formId = params.formId as string;
  const [isSumbitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [storageValue, setStorageValue] = useLocalStorage(
    FermionFormLocalStorageKey,
    { [formId]: {} }
  );
  const [page, setPage] = useState(1);

  const { data: response, isLoading: formLoading } = useQuery({
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

  async function submitResponse() {
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
  }

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
      if (values[key]) {
        if (Array.isArray(values[key])) {
          (values[key] as FormDataEntryValue[]).push(value);
        } else {
          values[key] = [values[key] as FormDataEntryValue, value];
        }
      } else {
        values[key] = value;
      }
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
        const response = await apiClient.post(`/forms/${formId}/response`);
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
                  value: values[InputName] as string | string[],
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
                value: values[InputName] as string | string[],
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
  }, [isSumbitting]);

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

  const BlockDisplayComponent = BlockDisplayMap[selectedBlockData.type] || null;
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
            {BlockDisplayComponent && (
              <BlockDisplayComponent
                selectedBlockData={selectedBlockData}
                name={InputName}
                key={selectedBlockData.id}
                required={selectedBlockData.required}
                defaultValue={values}
                ref={inputRef}
              />
            )}
          </BlockDisplayLayout>
        </form>
      </div>
    </FormSubmissionLayout>
  );
}
