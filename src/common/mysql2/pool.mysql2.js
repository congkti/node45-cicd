import mysql from "mysql2";
// =========[Dùng MySQL2 để tương tác dữ liệu]=========
// MySQL - tạo 1 cổng kết nối vào db
const pool = mysql
  .createPool({
    host: "localhost",
    port: "3307", //port của mysql-docker
    // host: "172.17.0.2", // dùng host này khi build dockerfile
    // port: "3306", // dùng port này khi build dockerfile
    user: "root",
    password: "1234",
    database: "db_cyber_media",
    timezone: "Z", // thuộc tính này để ko chuyển thời gian trong db sang giờ UTC, vì dữ liệu tg trong db đã là giờ UTC rồi (lấy đúng TG đã lưu trong db)
  })
  .promise(); // thêm promise để hỗ trợ async await ở phương thức tạo api

export default pool;
