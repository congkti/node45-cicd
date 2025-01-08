import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import authService from "../../services/auth.service.js";
import prisma from "../prisma/init.prisma.js";

describe("Register", () => {
  beforeEach(() => {
    console.log("chạy trước hàm it");

    // tránh ko cho tạo db khi Test
    jest.spyOn(prisma.users, "create"); //=> theo giỏi hành động create trong bảng user --> do ko chạy thật nên bên dưới tạo mô phỏng giá trị trả về dưới hàm IT
  });

  afterEach(() => {
    console.log("chạy sau hàm it");
  });

  describe("authService.register", () => {
    it("Case 1: Trường hợp đăng ký thành công với thông tin hợp lệ", async () => {
      // throw new Error("Lỗi rồi nè");
      //   console.log("Hàm it() chạy");

      //   Với await => dùng mockResolvedValue
      //   Không có await => dùng mockReturnValue
      await prisma.users.create.mockResolvedValue({
        user_id: 11,
        email: "test@gmail.com",
        full_name: "test",
        avatar: null,
        google_id: null,
        face_app_id: null,
        created_at: "2024-11-09T08:40:46.000Z",
        updated_at: "2024-11-09T08:40:46.000Z",
        role_id: 2,
      });

      const userNew = await authService.register({
        body: {
          email: "test@gmail.com",
          pass_word: "1234",
          full_name: "Test BUi",
        },
      });
      console.log(userNew);

      expect(userNew).not.toHaveProperty("pass_word");
      expect(typeof userNew.email).toBe("string");
      expect(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(userNew.email)).toBe(
        true
      );
    });

    it("Case 2: Nên báo lỗi nếu email đã tồn tại", () => {
      //   console.log("Hàm it() chạy");
    });
  });
});
