import prisma from "../common/prisma/init.prisma.js";
import _ from "lodash"; // thường đặt tên là _

export const permissionService = {
  create: async function (req) {
    const { name, endpoint, method, module } = req.body;

    const newPermission = await prisma.permissions.create({
      data: {
        name: name,
        endpoint: endpoint,
        method: method,
        module: module,
      },
    });
    return newPermission;
  },

  findAll: async function (req) {
    let { page, pageSize } = req.query;
    page = page * 1 > 0 ? page * 1 : 1;
    pageSize = pageSize * 1 > 0 ? pageSize * 1 : 3;
    const totalItem = await prisma.permissions.count();
    const totalPage = Math.ceil(totalItem / pageSize);

    const permissions = await prisma.permissions.findMany({
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
      items: permissions || [],
    };

    // return `This action returns all permission`;
  },

  findOne: async function (req) {
    return `This action returns a id: ${req.params.id} permission`;
  },

  update: async function (req) {
    return `This action updates a id: ${req.params.id} permission`;
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} permission`;
  },

  // phân quyền
  groupByModule: async (req) => {
    const roleId = req.params.id * 1;
    const permission = await prisma.permissions.findMany({
      include: {
        role_permissions: {
          where: {
            role_id: roleId,
            is_active: true,
          },
        },
      },
    });

    return _.groupBy(permission, "module");
    // kết quả tag html trả về sẽ group theo module với thông tin của object permission:
    // - key của mảng -> label của group (bộ api)
    // - các thông tin khác là nội dung con của group
  },
};
