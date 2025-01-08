import express from "express";
import authController from "../controllers/auth.controller.js";
import protect from "../common/middlewares/protect.middleware.js";

const authRouter = express.Router();

// register
authRouter.post("/register", authController.register);
// login
authRouter.post("/login", authController.login);

// login facebook
authRouter.post("/facebook-login", authController.loginFacebook);

// api refresh token
authRouter.post("/refresh-token", authController.refreshToken);

// get info use on socket chat
authRouter.get("/get-info", protect, authController.getInfo);

export default authRouter;
