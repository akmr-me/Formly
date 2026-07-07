import { Router } from "express";
import authRouter from "../routes/auth";
import formRouter from "../routes/form";
import blockRouter from "../routes/block";

const router = Router();

router.use("/auth", authRouter);
router.use("/forms", formRouter);
router.use("/blocks", blockRouter);

export default router;
