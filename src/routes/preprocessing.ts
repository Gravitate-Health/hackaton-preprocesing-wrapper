import { Router } from "express";
import * as preprocessingController from "../controllers/preprocessing";
export const PreprocessorWrapperRouter: Router = Router();

PreprocessorWrapperRouter.post("/preprocess", preprocessingController.preprocess);
