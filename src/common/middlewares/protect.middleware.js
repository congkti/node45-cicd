import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constant/app.constant.js";
import prisma from "../prisma/init.prisma.js";
import { ForbiddenError, UnauthorizedError } from "../helpers/error.helper.js";

const protect = async (req, res, next) => {
  // khi token hết hạn sẽ gây ra lỗi server => để tránh tình trạng crash server thì cần bọc middleware protect vào try catch để bắt lỗi này
  try {
    // middleware protect api
    // bóc tách accessToken trong chuỗi authorization truyền lên của req
    // hàm split() để tách Chữ Bearer mặc định của phương thức ra chỉ lấy token
    // console.log(
    //   "protect: req.headers.authorization>>",
    //   req.headers.authorization
    // );
    const accessToken = req.headers?.authorization?.split(" ")[1];
    // console.log("protect->", accessToken);
    if (!accessToken)
      throw new UnauthorizedError(
        "Vui lòng cung cấp token để truy cập api này"
      );
    // ====> có accessToken rồi dùng chuỗi này để so sánh với khóa bí mật đã lưu trong env để xem user này có được phép cấp quyền không
    // khi dùng phương thức verify nếu token hết hạn sẽ trả lỗi tại đây về lỗi mặc định 500. Tuy nhiên cần trả lỗi đúng cho FE là 403 để FE call refresh token!!!

    //    ****    cách 1: custorm lại bắt lỗi 403 để gửi cho FE ở error.helper.js -> ưu tiên dùng cách này để linh hoạt bắt nhiều mã lỗi
    const decodeToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    //    ****    cách 2: custom lại bắt lỗi 403 bằng option của phương thức verify tại đây
    // const decodeToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err) => {
    //   if (err)
    //     return res
    //       .status(403)
    //       .json({ message: "Token expired", code: 403 });
    // });

    //console.log(decodeToken); //=> userID, exp...
    // vào db kiểm tra xem có tồn tại user này trong db không?
    const user = await prisma.users.findUnique({
      where: {
        user_id: decodeToken.userID,
      },
      select: {
        roles: true, //
        user_id: true,
        email: true,
        full_name: true,
        avatar: true,
        google_id: true,
        face_app_id: true,
      },
    });
    // Nếu ko có user => throw lỗi 403
    if (!user) throw new ForbiddenError();

    // Nếu có user: truyền user vào req để gửi tới middleware tiếp theo qua next()
    // key user trong obj req: nếu chưa có sẽ tự tạo mới -> cơ chế của js
    req.user = user; //=> qua middleware tiếp sẽ tự có user

    next();
  } catch (error) {
    next(error);
  }
};
export default protect;
