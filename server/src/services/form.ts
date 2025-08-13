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
