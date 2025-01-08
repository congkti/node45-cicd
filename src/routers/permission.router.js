import express from "express";
import { permissionController } from "../controllers/permission.controller.js";

const permissionRouter = express.Router();

// Tạo route CRUD
permissionRouter.post("/", permissionController.create);
permissionRouter.get("/", permissionController.findAll);
permissionRouter.get("/:id", permissionController.findOne);
permissionRouter.patch("/:id", permissionController.update);
permissionRouter.delete("/:id", permissionController.remove);

// phân quyền
permissionRouter.get(
  "/group-by-module/:id",
  permissionController.groupByModule
);

export default permissionRouter;
