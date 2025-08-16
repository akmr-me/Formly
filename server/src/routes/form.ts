import { Router } from "express";
import { fileterRequest } from "../middlewares/fileterRequest";
import { createFormSchema } from "../validators/form";
import {
  createFormController,
  getFormWithBlocksController,
  publishFormController,
  getPaginatedPublishedBlocksController,
  getFormByIdController,
  createResponseController,
  createResponseValuesController,
} from "../controllers/form";

const router = Router();

// router.get("/", (req, res) => {});
// TODO: fix spelling change
router.post("/", fileterRequest(createFormSchema), createFormController);

router.get("/:shortFormId", getFormByIdController);

router.get("/:shortFormId/blocks", getFormWithBlocksController);

router.patch("/:shortFormId/publish", publishFormController);

router.post("/:shortFormId/response", createResponseController);
router.post(
  "/:shortFormId/response/:responseId",
  createResponseValuesController
);

router.get(
  "/:shortFormId/published-blocks",
  getPaginatedPublishedBlocksController
);

export default router;

let form = {
  dlfjdljflj: {
    submissions: {
      "26a57026-cc70-4003-9d48-5f9299c12979": {
        value: "3",
        status: "saved",
      },
    },
    submission_id: "1wwkmp9mt2",
    created_at: "2025-08-15T12:41:36.331Z",
  },
};

let submission: {
  submission_id: "h26djmqwgr";
  created_at: "2025-08-08T19:20:34.076Z";
  wyn5ob5l: {
    submissions: {
      "26a57026-cc70-4003-9d48-5f9299c12979": {
        value: "4552";
        status: "saved";
      };
      "e5805d90-0652-40e1-915a-f28304160f3f": {
        value: "https://google.in";
        status: "saved";
      };
      "8ac8c1b3-2bd0-4d55-8b81-6f991cdaa6e9": {
        value: {
          id: "f1ae485b-1c7a-46fa-9b4a-59f91c38fbca";
          value: "Option 2";
        };
        status: "pending";
      };
      "58a95909-8d45-4ac6-960f-c839ecbfd07a": {
        value: [
          { id: "21f81bc6-6258-4de4-84df-119827e29171"; value: "Option 1" }
        ];
        status: "pending";
      };
      "c1d5f36a-f312-4e96-a86a-90eb8aae9493": {
        value: {
          id: "d0ab918a-0232-40a6-bbb5-e5358219100a";
          value: "Option 1";
        };
        status: "pending";
      };
    };
  };
};
