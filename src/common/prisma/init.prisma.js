import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // che pw ko cho gửi kết quả về cho FE_phải bật tính năng ở schema.prisma
  //   tất cả api đều ko trả pw về
  omit: {
    users: {
      pass_word: true,
    },
  },
});

export default prisma;
