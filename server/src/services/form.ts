import ApiError from "../utils/ApiError";
import formRespository from "../repositories/Form";
import { generateFormId } from "../utils/generateFormId";

export async function createFormService() {
  const shortId = generateFormId();

  const form = await formRespository.createForm({ shortId });
  if (!form) {
    throw new ApiError(500, "Failed to create form");
  }

  return form;
}

export async function getFormByShortIdService(shortId: string) {
  const form = await formRespository.getFormByShortId(shortId);
  if (!form) {
    throw new ApiError(404, `Form with shortId ${shortId} not found`);
  }
  return form;
}

export async function getFormWithBlocksService(formId: string) {
  const form = await formRespository.getFormWithBlocks(formId);
  if (!form) {
    throw new ApiError(404, `Form with ID ${formId} not found`);
  }
  return form;
}

export async function publishFormService(shortFormId: string) {
  const form = await formRespository.publishForm(shortFormId);

  return form;
}

export async function getPaginatedPublishedBlocksService(
  shortFormId: string,
  page: number,
  limit: number = 1
) {
  const form = await formRespository.getPaginatedPublishedBlocks(
    shortFormId,
    page,
    limit
  );
  if (!form) {
    throw new ApiError(
      404,
      `No published blocks found for form ${shortFormId}`
    );
  }
  return form;
}

export async function createResponseService(shortFormId: string) {
  const formResponse = await formRespository.createResponse(shortFormId);
  if (!formResponse) {
    throw new ApiError(404, `Form with shortId ${shortFormId} not found`);
  }
  return formResponse;
}

export async function createResponseValuesService(
  responseId: string,
  responseData: Record<string, any>
) {
  await formRespository.createResponseValues(responseId, responseData);
}
