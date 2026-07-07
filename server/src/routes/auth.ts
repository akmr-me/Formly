import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
  signupController,
} from "../controllers/auth";
import { fileterRequest } from "../middlewares/fileterRequest";
import { authCredentialsSchema } from "../validators/auth";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/signup", fileterRequest(authCredentialsSchema), signupController);
router.post("/login", fileterRequest(authCredentialsSchema), loginController);
router.post("/logout", logoutController);
router.get("/me", authenticate, meController);

export default router;
