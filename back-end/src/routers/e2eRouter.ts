import { Router } from "express";
import { reset } from "../controllers/e2eController.js";

const e2eRouter = Router();

e2eRouter.post("/e2e/reset", reset);

export default e2eRouter;
