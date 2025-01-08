import { DataTypes, NOW } from "sequelize";
import sequelize from "../common/sequelize/connect.sequelize.js";

// 3. [CODE FIRST] Tạo model các cột,table bằng code: đi từ code để tạo ra db -> sau đó tương tác db
// 3.1. tạo model
const videoTypeModel = sequelize.define(
  "video_type",
  {
    type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    updated_at: {
      type: DataTypes.DATE, //=> kiểu DATE sẽ lấy đúng thời gian UTC
      allowNull: false,
      defaultValue: NOW,
    },
  },
  {
    tableName: "video_type",
    // vì đã có "created_at" và "updated_at" nên ko cần sd timestamp => false
    // nếu db chưa có 2 field này thì để true => mặc định sẽ tạo ra 2 cột createdAt và updatedAt
    timestamps: false,
  }
);

export default videoTypeModel;
