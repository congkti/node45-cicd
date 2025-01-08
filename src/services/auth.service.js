import {
  BadRequestError,
  UnauthorizedError,
} from "../common/helpers/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenService from "./token.service.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/app.constant.js";
import sendMail from "../common/nodemailer/sendmail.nodemailer.js";

const authService = {
  register: async (req) => {
    const { email, pass_word, full_name } = req.body;

    // kiểm tra email tồn tại chưa
    const userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists) {
      throw new BadRequestError("Email đã tồn tại. Vui lòng đăng nhập");
    }
    // mã hóa pw
    const hashPassword = bcrypt.hashSync(pass_word, 10);
    const userNew = await prisma.users.create({
      data: {
        email: email,
        full_name: full_name,
        pass_word: hashPassword,
      },
    });
    // userNew.pass_word = "xxxx";
    // console.log(userNew);

    // Tạo tk thành công -> gửi mail thông báo
    await sendMail(
      email,
      "Đăng ký user thành công",
      `Chào mừng bạn ${full_name}, đã đăng ký thành công user tại www.kaychipchip.com bằng email ${email}`,
      `
      <b>Chào mừng bạn ${full_name}</b><br/>
      Bạn đã đăng ký thành công user tại www.kaychipchip.com.<br/> 
      Thông tin đăng ký của bạn như sau: <br/>
      - Email: ${email} <br/>
      - Password: ${pass_word}`
    );

    return userNew;
  },
  login: async (req) => {
    // BƯỚC 1: nhận dữ liệu từ body
    const { email, pass_word } = req.body;

    // BƯỚC 2: kiểm tra email:
    // - đã tồn tại => đi tiếp
    // - chưa tồn tại => trả lỗi "Email không tồn tại, Vui lòng đăng ký"
    const userExists = await prisma.users.findFirst({
      where: {
        email,
      },
      select: {
        user_id: true,
        pass_word: true,
      },
    });
    if (!userExists)
      throw new BadRequestError("Email không tồn tại! Vui lòng đăng ký"); // throw có tính return

    // BƯỚC 3: kiểm tra password
    // console.log(userExists);
    // sẽ ko có pw trong userExists  do đã ẩn đi trong src\common\prisma\init.prisma.js
    // => sẽ mở pw ra chỉ ở login này bằng keyword select trên phương thức truy vấn
    // => chỉ show trường nào đc bật trong select
    const passHash = userExists.pass_word;
    // so sánh pw trong db với pw gửi lên bằng compare trong bcrypt
    const isPassword = bcrypt.compareSync(pass_word, passHash); //=> true|false
    if (!isPassword) throw new BadRequestError("Mật khẩu không chính xác");
    // ======================Tips================================================
    // thực tế: các thông báo lỗi về auth nên để dạng chung chung (không cần quá rõ ràng), ex: "Email hoặc mật khẩu chưa chính xác."
    // => Mục đích để giảm phần trăm cơ hội cho hacker
    // ===========================================================================

    // BƯỚC 4: Tạo accessToken và RefreshToken -> trả kết quả cho FE
    const tokens = tokenService.createTokens(userExists);

    return { tokens };
  },

  // Login Facebook
  // Vào Facebook dev tao App
  // Ở trang dashboard chọn Trường hợp ứng dụng > Tùy Chỉnh
  // Mục Email > Click Thêm
  // Lấy ID ứng dụng -> lấy AppID khai báo cho FE
  loginFacebook: async (req) => {
    // BƯỚC 1: nhận dữ liệu từ body (được gửi từ FE tới sau khi xác thực trạng thái đăng nhập của bên thứ 3 (fb)
    const { email, id, name, picture } = req.body;
    // console.log({ email, id, name, picture });

    // BƯỚC 2: Kiểm tra email đã có trên db chưa
    let userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
        pass_word: true,
        full_name: true,
        avatar: true,
      },
    });
    if (userExists) {
      // User đã tồn tại trên db => Ko cần làm gì. Tuy nhiên để chặt chẽ nên Update thông tin các trường trong db nếu chưa có.
      prisma.users.update({
        // sẽ update full_name, avatar nếu chưa có
        where: {
          user_id: userExists.user_id,
        },
        data: {
          full_name: userExists.full_name ? undefined : name,
          avatar: userExists.avatar ? undefined : picture.data.url,
        },
      });
      // return "user đã tồn tại";
    } else {
      // BƯỚC 3: nếu user chưa tồn tại trong hệ thống của mình => tạo mới
      userExists = await prisma.users.create({
        data: {
          face_app_id: id,
          full_name: name,
          email: email,
          avatar: picture.data.url,
        },
      });
    }

    // BƯỚC 4: Tạo accessToken và RefreshToken -> trả kết quả cho FE
    const tokens = tokenService.createTokens(userExists);

    return { tokens };
  },

  refreshToken: async (req) => {
    // * LẤY TOKEN TRUYỀN LÊN TỪ req:
    // accessToken thông thường lấy như này:
    // const accessToken = req.headers?.authorization?.split(" ")[1];
    //  tuy nhiên với source FE này đã đảo ngược accessToken với refreshToken (accessToken được lưu trong key x-access-token khi gửi về cho FE) nên cách lấy 2 token sẽ như bên dưới:
    // console.log(
    //   "callRefresh: req.headers.authorization>>",
    //   req.headers.authorization
    // );
    const refreshToken = req.headers?.authorization?.split(" ")[1];
    const accessToken = req.headers["x-access-token"];
    // console.log({ refreshToken, accessToken });
    // check req gửi lên nếu ko có token
    if (!refreshToken) throw new UnauthorizedError();
    if (!accessToken) throw new UnauthorizedError();

    // * KIỂM TRA TOKEN
    const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true, // option để bỏ qua kiểm tra accesstoken hết hạn (khi chạy refreshToken thì ko cần kiểm tra accesstoken)
    });

    if (decodeRefreshToken.userID !== decodeAccessToken.userID)
      throw new UnauthorizedError();

    // BƯỚC 3: kiểm tra user có tồn tại trong db ko
    const user = await prisma.users.findUnique({
      where: {
        user_id: decodeRefreshToken.userID,
      },
    });

    // BƯỚC 4: Tạo accessToken và RefreshToken MỚI -> trả kết quả cho FE
    const tokens = tokenService.createTokens(user);

    return tokens;
  },

  getInfo: async (req) => {
    // console.log({ user: req.user });
    return req.user;
  },
};

export default authService;
