import { BadRequestError } from "../common/helpers/error.helper.js";
import pool from "../common/mysql2/pool.mysql2.js";
import prisma from "../common/prisma/init.prisma.js";
import videoTypeModel from "../models/video-type.model.js";

// service xử lý logic
const videoService = {
  // MySQL2
  listVideo: async (req) => {
    //console.log(abc); //vd lỗi ko kiểm soát đc

    // vd lỗi kiểm soát được
    // const passDB = 1234;
    // const passUser = 1235;
    // if (passDB !== passUser) {
    //   throw new BadRequestError("Mật khẩu không chính xác");
    // }

    // const [result, fields] = await pool.query("SELECT * FROM videos");
    // console.log(result);

    // return result; //=> phải trả về kết quả để bên controller chạy function

    // dùng prisma
    let { page, pageSize } = req.query;
    page = page * 1 > 0 ? page * 1 : 1;
    pageSize = pageSize * 1 > 0 ? pageSize * 1 : 3;
    const totalItem = await prisma.videos.count();
    const totalPage = Math.ceil(totalItem / pageSize);

    const videos = await prisma.videos.findMany({
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
      items: videos || [],
    };
  },

  // SEQUELIZE
  // 3. [DB FIRST]
  // 3.2. Tạo api
  videoType: async (req) => {
    // // thay vì ghi các query sql thì chỉ cần chạy hàm cho object model
    // const result = await videoTypeModel.findAll(); //=> tương đương sql: SELECT * FROM video_type

    // return result;

    // dùng prisma

    const videoTypes = await prisma.video_type.findMany();
    return videoTypes;
  },
  // 4. [CODE FIRST]
};

export default videoService;
