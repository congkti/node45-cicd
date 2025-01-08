import { ForbiddenError } from "../helpers/error.helper.js";
import prisma from "../prisma/init.prisma.js";

const checkPermission = async (req, res, next) => {
  try {
    const routePath = req.route.path;
    const baseUrl = req.baseUrl;
    const method = req.method;
    const fullPath = `${baseUrl}${routePath}`;
    // console.log({ routePath, baseUrl, method });
    // => { routePath: '/video-list', baseUrl: '/video', method: 'GET' }

    const roleId = req.user.role_id;
    if (roleId === 1) {
      next();
      return;
    }

    const role_permissions_exits = await prisma.role_permissions.findFirst({
      where: {
        permissions: {
          endpoint: fullPath,
          method: method,
        },
        role_id: roleId,
        is_active: true,
      },
    });

    if (!role_permissions_exits)
      throw new ForbiddenError("User không được quyền truy cập tính năng này");

    next(); // phải có next để chạy qua middleware tiếp theo
  } catch (error) {
    next(error);
  }
};

export default checkPermission;
