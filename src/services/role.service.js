import prisma from "../common/prisma/init.prisma.js";

export const roleService = {
  create: async function (req) {
    return `This action create`;
  },

  findAll: async function (req) {
    let { page, pageSize } = req.query;
    page = page * 1 > 0 ? page * 1 : 1;
    pageSize = pageSize * 1 > 0 ? pageSize * 1 : 3;
    const totalItem = await prisma.roles.count();
    const totalPage = Math.ceil(totalItem / pageSize);

    const roles = await prisma.roles.findMany({
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
      items: roles || [],
    };

    // return `This action returns all role`;
  },

  findOne: async function (req) {
    const role = prisma.roles.findUnique({
      where: {
        role_id: req.params.id * 1,
      },
    });
    return role;
  },

  update: async function (req) {
    return `This action updates a id: ${req.params.id} role`;
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} role`;
  },

  // toggle Permission
  togglePermission: async (req) => {
    const { permission_id, role_id } = req.body;
    const role_permissions_exist = await prisma.role_permissions.findFirst({
      where: {
        permission_id,
        role_id,
      },
    });

    if (role_permissions_exist) {
      // có tồn tại => lật is_active lại
      const toggle = !role_permissions_exist.is_active;
      await prisma.role_permissions.update({
        where: {
          role_permissions_id: role_permissions_exist.role_permissions_id,
        },
        data: {
          is_active: toggle,
        },
      });
    } else {
      // nếu ko có => tạo mới => is_active=true
      await prisma.role_permissions.create({
        data: {
          role_id,
          permission_id,
        },
      });
    }

    return "togglePermission";
  },
};
