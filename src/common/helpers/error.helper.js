import { responseError } from "./response.helper.js";
import pkg from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = pkg;

// middleware (4 tham số) cuối cùng server để bắt lỗi theo chuẩn express
export const handlerError = (err, req, res, next) => {
  console.log("Lỗi ở middleware cuối cùng", err);

  // custom để bắt lỗi chi tiết trả cho FE đúng ý nghĩa lỗi
  // *** LƯU Ý****: lỗi 403 kế thừa lỗi từ 401 nên phải để lỗi 401 trước -> lỗi 403 thì mới bắt chính xác lỗi 403. Hoặc dùng if {401} else {403}
  // fix cho trường hợp sai token => 401
  if (err instanceof JsonWebTokenError) {
    err.code = 401;
    err.message = "Invalid token";
  }
  // fix cho trường hợp trả lỗi token hết hạn => 403
  if (err instanceof TokenExpiredError) {
    err.code = 403;
    err.message = "Token expired";
  }

  const resData = responseError(err.message, err.code);
  res.status(resData.code).json(resData);
};

// tạo 1 class kế thừa class Error
// bắt lỗi kiểm soát được
export class BadRequestError extends Error {
  constructor(message = "BadRequestError") {
    super(message);
    this.code = 400;
  }
}

// bắt lỗi 403 - refresh token - get new access token
export class ForbiddenError extends Error {
  constructor(message = "ForbiddenError") {
    super(message);
    this.code = 403;
  }
}

// bắt lỗi 401 - logout khỏi hệ thống
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized Error") {
    super(message);
    this.code = 401;
  }
}
