import express from "express";
import { userController } from "../controllers/user.controller.js";
import uploadLocal from "../common/multers/upload-local.multer.js";
import uploadCloud from "../common/multers/upload-cloud.multer.js";
import protect from "../common/middlewares/protect.middleware.js";

const userRouter = express.Router();

// Tạo route CRUD
userRouter.post("/", userController.create);
userRouter.get("/", userController.findAll);
userRouter.get("/:id", userController.findOne);
userRouter.patch("/:id", userController.update);
userRouter.delete("/:id", userController.remove);

// upload avartar
userRouter.use(protect);

userRouter.post(
  "/avatar-local",
  uploadLocal.single("avatar"),
  userController.uploadAvatar
);
userRouter.post(
  "/avatar-cloud",
  uploadCloud.single("avatar"),
  userController.uploadAvatar
);

export default userRouter;
