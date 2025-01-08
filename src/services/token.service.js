import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/app.constant.js";

const tokenService = {
  createTokens: (user) => {
    // BƯỚC 4: Tạo accessToken và RefreshToken -> trả kết quả cho FE
    const accessToken = jwt.sign(
      { userID: user.user_id },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES,
      }
    );

    // tạo refreshToken
    // -> Khi accessToken hết hạn thì refreshToken sẽ làm mới accessToken
    // -> !!!!!!Thông thường accessToken sẽ trả về cho FE quản lý, còn refreshToken sẽ đc lưu trên db (ở đây cơ bản sẽ gửi hết về cho FE quản lý)
    const refreshToken = jwt.sign(
      { userID: user.user_id },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES,
      }
    );
    return { accessToken, refreshToken };
  },
};

export default tokenService;
