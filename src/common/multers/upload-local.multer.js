import multer from "multer";
import path from "path";
import fs from "fs";

// const upload = multer({ dest: "images/" });

// tạo thư mục nếu chưa có
fs.mkdirSync("images/", { recursive: true });

// lưu file vào thư mục chỉ định (ko có dấu / ở cuối)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + "-local-" + uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

const uploadLocal = multer({ storage: storage });

export default uploadLocal;
