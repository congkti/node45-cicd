// Bước 1: npm init
// Bước 2: npm i express

// Reload server
// Cách 1: dùng thư viện nodemon
// Cách 2: dùng --watch của node hỗ trợ

import express from "express";

import cors from "cors"; // middleware để quản lý quá trình chặn api CORS của trình duyệt
import rootRouter from "./src/routers/root.router.js";
import { handlerError } from "./src/common/helpers/error.helper.js";
import { createServer } from "node:http";
import initSocket from "./src/common/socket/init.socket.js";
import schema from "./src/common/graphql/schema.graphql.js";
import root from "./src/common/graphql/root.graphql.js";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

const app = express();
const server = createServer(app);

// sử dụng middledware để chuyển JSON sang đối tượng js (object,...)
// sử dụng với body khi truyền dữ liệu
app.use(express.json());

// middleware cors để quản lý chặn cors của trình duyệt
//app.use(cors()); //=> cho phép tất cả các nguồn được lấy dữ liệu
// ==> nếu muốn giới hạn nguồn đc lấy thì thêm orgin của FE đó vào 1 object trong hàm cors()
app.use(
  cors({
    origin: ["http://localhost:5173", "https://google.com"], //=> chỉ cho phép localhost:5173 và google.com đc phép lấy
  })
);

// set static root path
app.use(express.static("."));

// graphql tạo api (nếu ko dùng RES HTTP)
// Serve the GraphiQL IDE.
app.get("/ruru", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.use(rootRouter); //=> chuyển qua router quản lý

// MIDDLEWARE CUỐI CÙNG (4 tham số) ĐỂ BẮT LỖI
// -> để sau rootRouter: nếu trong rootRouter có bất kỳ middleware nào có chạy hàm next(param) thì sẽ đều nhảy đến middleware cuối cùng này
app.use(handlerError);

// =========[Dùng MySQL2 để tương tác dữ liệu]=========
// MySQL - tạo 1 cổng kết nối vào db  ---> dùng chung common/pool.mysql2.js

// Tạo api  ---> rootRouter.js --> videoRouter.js

// EOF =====[Dùng MySQL để tương tác dữ liệu]=====

// =========[Dùng ORM SEQUELIZE để tương tác dữ liệu]=========
// 1. tạo kết nối với db --> common/connect.sequelize.js

// 2. kiểm tra kết nối  --> common/connect.sequelize.js

// 3. [CODE FIRST] Tạo model các cột,table bằng code: đi từ code để tạo ra db -> sau đó tương tác db
// 3.1. tạo model   --> models/video-type.model.js

// 3.2. Tạo api   --> video.router.js > video.controller.js > video.service.js

// 4. [DB FIRST] Tạo database trước, sau đó dùng lệnh kéo db vào để tương tác với db

// EOF =====[Dùng SEQUELIZE để tương tác dữ liệu]=====

// socket
initSocket(server);

// =========[Tạo cổng kết nối để bật hệ thống BackEnd]=========
const PORT = 3069;
server.listen(PORT, () => {
  console.log(`Server online at port ${PORT}`);
});
// EOF =====[Tạo cổng kết nối để bật hệ thống BackEnd]=====

// ============== bk tham khảo =============

// // có 4 cách nhận dữ liệu:

// /**
//  * Cách 1: Query Parameters
//  * nhận biết: bắt đầu bằng dấu ? phân cách các key bằng dấu &. dùng cho phân trang, lọc, search,...
//  */
// app.get("/query", (request, response, next) => {
//   const query = request.query;
//   console.log({ query });

//   response.json(`Query Parameters`);
// });

// /**
//  * Cách 2: Patch Parameters
//  * cách nhận biết: dùng /:ten_bien
//  * Thường dùng: khi muốn lấy dữ liệu cụ thể của MỘT đối tượng
//  */
// app.get("/patch/:id", (request, response, next) => {
//   const params = request.params;
//   console.log(params);

//   response.json(`Patch Parameters`);
// });

// /**
//  * Cách 3: Body
//  * với kiểu body, FE sẽ gửi đến BE 1 JSON, và BE cũng trả về 1 JSON => cần chuyển JSON này sang đối tượng js (object,...) để khỏi undefined
//  * Để chuyển: dùng express.json() chạy trong 1 midleware (sử dùng midleware, ko phải xây dựng): dùng app.use()
//  * Phải sử dụng trước lệnh router (end point)
//  * Thường dùng cho dữ liệu phức tạp, nhiều lớn
//  */
// app.post("/body", (request, response, next) => {
//   const body = request.body;
//   console.log(body);
//   response.json(`Body`);
// });

// /**
//  * Cách 4: Headers
//  */
// app.get("/headers", (request, response, next) => {
//   const headers = request.headers;
//   console.log({ headers });
//   response.json("headers");
// });
