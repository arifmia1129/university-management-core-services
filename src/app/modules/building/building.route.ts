import express from "express";
import * as buildingController from "./building.controller";
import requestValidator from "../../middleware/requestValidator";
import * as buildingValidation from "./building.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", buildingController.getAllBuilding);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(buildingValidation.createBuildingValidation),
  buildingController.createBuilding,
);

router
  .route("/:id")
  .get(buildingController.getBuildingById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(buildingController.deleteBuildingById)
  .patch(
    requestValidator(buildingValidation.updateBuildingValidation),
    buildingController.updateBuildingById,
  );

export const buildingRouter = router;
