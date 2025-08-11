import { Router } from "express";
import formRouter from "../routes/form";
import blockRouter from "../routes/block";

const router = Router();

router.use("/forms", formRouter);
router.use("/blocks", blockRouter);

export default router;
