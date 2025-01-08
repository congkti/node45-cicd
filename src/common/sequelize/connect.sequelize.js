import { Sequelize } from "sequelize";

// SEQUELIZE
// 1. tạo kết nối với db
const sequelize = new Sequelize("db_cyber_media", "root", "1234", {
  // host: "localhost", // dùng host này khi chạy trên local
  // port: "3307", // dùng port này khi chạy trên local
  // host: "172.17.0.2", // dùng host này khi build dockerfile
  host: "some-mysql-compose", // dùng host này khi build dockerfile
  port: "3306", // dùng port này khi build dockerfile
  dialect: "mysql",
  logging: false, //=> để bật/tắt log ra các query sql của sequelize khi tạo kết nối với db
});

// 2. kiểm tra kết nối
sequelize
  .authenticate()
  .then((res) => {
    console.log("sequelize: Kết nối db thành công");
  })
  .catch((err) => {
    console.log(err);
    console.log("sequelize: Kết nối db không thành công");
  });

export default sequelize;
