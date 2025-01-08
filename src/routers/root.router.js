import express from "express";
import videoRouter from "./video.router.js";
import authRouter from "./auth.router.js";
import roleRouter from "./role.router.js";
import permissionRouter from "./permission.router.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init.swagger.js";
import userRouter from "./user.router.js";

const rootRouter = express.Router();

// swagger
rootRouter.use("/api-docs", swaggerUi.serve);
// rootRouter.get("/api-docs", swaggerUi.setup(swaggerDocument));
// dùng code dưới để có thể lưu đc token trên swagger đỡ phải nhập lại nhiều lần khi F5
rootRouter.get("/api-docs", (req, res, next) => {
  // middleware để tự động lấy URL cho vào Server deploy trong khởi tạo swagger
  const urlServer = `${req.protocol}://${req.get("host")}`;

  swaggerDocument.servers = [
    // ...swaggerDocument.servers,
    {
      url: urlServer,
      description: "url server deploy",
    },
  ];
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  })(req, res);
});

// tạo một end-point api check server
// rootRouter.get("/", (request, response, next) => {
//   response.json(`OK`);
// });

// GIẢI THÍCH VỀ MIDDLEWARE
rootRouter.get(
  `/`,
  (req, res, next) => {
    console.log(1);
    const payload = `oke`;
    req.duLieuTruyenDi = payload;
    next();
  },
  (req, res, next) => {
    req.duLieuTruyenDi += ` + 1`;
    console.log(2);
    next();
  },
  (req, res, next) => {
    req.duLieuTruyenDi += ` + 2`;
    console.log(3);
    next();
  },
  (request, respone, next) => {
    respone.json(`oke`);
  }
);

// tạo quản lý routerVideo
rootRouter.use("/video", videoRouter);

// auth route
rootRouter.use("/auth", authRouter);

// role route
rootRouter.use("/role", roleRouter);

// permission route
rootRouter.use("/permission", permissionRouter);

// User route
rootRouter.use("/user", userRouter);

export default rootRouter;
