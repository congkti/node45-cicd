import { BadRequestError } from "../common/helpers/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";

export const userService = {
  create: async function (req) {
    return `This action create`;
  },

  findAll: async function (req) {
    let { page, pageSize } = req.query;
    page = page * 1 > 0 ? page * 1 : 1;
    pageSize = pageSize * 1 > 0 ? pageSize * 1 : 3;
    const totalItem = await prisma.users.count();
    const totalPage = Math.ceil(totalItem / pageSize);

    const users = await prisma.users.findMany({
      // take <=> LIMIT trong SQL
      take: pageSize,
      // skip <=> OFFSET trong SQL
      skip: (page - 1) * pageSize,

      orderBy: {
        created_at: "desc",
      },
    });
    return {
      page,
      pageSize,
      totalItem,
      totalPage,
      items: users || [],
    };

    return `This action returns all user`;
  },

  findOne: async function (req) {
    return `This action returns a id: ${req.params.id} user`;
  },

  update: async function (req) {
    return `This action updates a id: ${req.params.id} user`;
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} user`;
  },

  // upload avatar
  uploadAvatar: async function (req) {
    console.log(req.file);
    const file = req.file;
    if (!file) throw new BadRequestError("Không có file trong req");

    // kiểm tra xem file có chứa "local" ko để trả về đúng đường dẫn
    const isImgLocal = req.user.avatar?.includes("local");

    // update avatar cho user
    await prisma.users.update({
      where: {
        user_id: +req.user.user_id,
      },
      data: {
        avatar: file.path,
      },
    });

    return {
      folder: `images/`,
      filename: file.filename,
      imgUrl: isImgLocal ? `images/${file.filename}` : file.path,
    };
  },
};
