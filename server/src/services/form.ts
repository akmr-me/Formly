import formRespository from "../repositories/Form";
import { generateFormId } from "../utils/generateFormId";

export async function createFormService() {
  const shortId = generateFormId();
  try {
    const form = await formRespository.createForm({ shortId });
    return form;
  } catch (error) {
    // generate shortid again if already exists
    console.log("createForm error", error);
  }
}

export async function getFormByShortIdService(shortId: string) {
  try {
    const form = await formRespository.getFormByShortId(shortId);
    return form;
  } catch (error) {
    console.log("getFormByShortId error", error);
  }
}

export async function getFormWithBlocksService(formId: string) {
  try {
    const form = await formRespository.getFormWithBlocks(formId);

    return form;
  } catch (error) {
    console.log("getFormWithBlocks error", error);
  }
}

export async function publishFormService(shortFormId: string) {
  try {
    const form = await formRespository.publishForm(shortFormId);
    return form;
  } catch (error) {
    console.log("publishForm error", error);
  }
}

export async function getPaginatedPublishedBlocksService(
  shortFormId: string,
  page: number,
  limit: number = 1
) {
  try {
    const form = await formRespository.getPaginatedPublishedBlocks(
      shortFormId,
      page,
      limit
    );
    return form;
  } catch (error) {
    console.log("getPaginatedPublishedBlocks error", error);
  }
}

export async function createResponseService(shortFormId: string) {
  try {
    const formResponse = await formRespository.createResponse(shortFormId);
    return formResponse;
  } catch (error) {
    console.log("createResponse error", error);
  }
}

export async function createResponseValuesService(
  responseId: string,
  responseData: Record<string, any>
) {
  try {
    const formResponse = await formRespository.createResponseValues(
      responseId,
      responseData
    );
    return formResponse;
  } catch (error) {
    console.log("createResponse error", error);
  }
}
