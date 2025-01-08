import {
  responseError,
  responseSuccess,
} from "../common/helpers/response.helper.js";
import videoService from "../services/video.service.js";

const videoController = {
  // MySQL2

  listVideo: async (req, res, next) => {
    try {
      // controller gửi dữ liệu cho service xử lý logic
      const result = await videoService.listVideo(req);
      // =========[format kết quả trả về cho đẹp]=========
      const resData = responseSuccess(
        result,
        "Lấy danh sách video thành công",
        200
      );
      // EOF =====[format kết quả trả về cho đẹp]=====

      // controller trả kêt quả cho FE
      // res.json(result);
      res.status(resData.code).json(resData); // => nếu muốn chỉnh code trả về thì thêm status(#code). Nếu ko có mặc định Thành công sẽ trả code 200
    } catch (error) {
      // console.log("lỗi ko kiểm soát đc", error);

      // //const resData = responseError(undefined, 500); // lỗi ko kiểm soát được dùng lệnh này
      // const resData = responseError(error.message, error.code); // lỗi kiểm soát được dùng lệnh này

      // res.status(resData.code).json(resData);

      // DÙNG MIDDLEWARE ĐỂ KIỂM SOÁT LỖI THEO TIÊU CHUẨN EXPRESS
      next(error); // truyền tham số vào next sẽ chuyển đến middleware có 4 tham số đc tạo ra ở server.js
      // => chuyển các xử lý lỗi bên trên qua server.js
    }
  },

  // SEQUELIZE
  // 3. [DB FIRST]
  // 3.2. Tạo api
  videoType: async (req, res, next) => {
    try {
      const result = await videoService.videoType();
      const resData = responseSuccess(result, "Lấy loại video thành công", 200);
      // controller trả kêt quả cho FE
      res.status(resData.code).json(resData);
      // res.json(result);
      //res.status(999).json(result); // => nếu muốn chỉnh code trả về thì thêm status(#code). Nếu ko có mặc định Thành công sẽ trả code 200
    } catch (error) {
      next(error);
    }
  },
  // 4. [CODE FIRST]
};

export default videoController;
