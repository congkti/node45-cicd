import express from "express";
import videoController from "../controllers/video.controller.js";
import protect from "../common/middlewares/protect.middleware.js";
import checkPermission from "../common/middlewares/check-permission.middleware.js";

// tạo bộ router cho video
const videoRouter = express.Router();

// =========[Dùng MySQL2 để tương tác dữ liệu]=========
// MySQL - tạo 1 cổng kết nối vào db ---> dùng chung common/pool.mysql2.js

// CÁCH 1: bảo vệ api dùng protect- lồng middleware vào từng route
// Tạo api
//videoRouter.get("/video-list", protect, videoController.listVideo);
// EOF =====[Dùng MySQL để tương tác dữ liệu]=====

// SEQUELIZE
// 3.2. Tạo api
//videoRouter.get("/video-type", protect, videoController.videoType);

// CÁCH 2 để bảo vệ api khi dự án nhiều api: chạy middleware protect riêng bên ngoài. Những api nào cần bảo vệ thì đặt sau middle ware protwct này. Nếu KHÔNG CẦN bảo vệ thì đặt trước.
// ---------video-list đặt trước protect => sẽ ko đc bảo vệ
videoRouter.get("/video-list", videoController.listVideo);

// -------middleware protect để bảo vệ api
videoRouter.use(protect);

// ---------video-type đặt sau protect => sẽ đc bảo vệ
videoRouter.get("/video-type", videoController.videoType);

export default videoRouter;
