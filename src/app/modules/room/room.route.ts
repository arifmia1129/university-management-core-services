import express from "express";
import * as RoomController from "./room.controller";
import requestValidator from "../../middleware/requestValidator";
import * as roomValidation from "./room.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", RoomController.getAllRoom);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(roomValidation.createRoomValidation),
  RoomController.createRoom,
);

router
  .route("/:id")
  .get(RoomController.getRoomById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(RoomController.deleteRoomById)
  .patch(
    requestValidator(roomValidation.updateRoomValidation),
    RoomController.updateRoomById,
  );

export const RoomRouter = router;
