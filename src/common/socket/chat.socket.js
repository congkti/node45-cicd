import prisma from "../prisma/init.prisma.js";

const chatSocket = (io, socket) => {
  // io: tín hiệu socket lớn nhất
  // socket: tín hiệu dành cho mỗi user
  //   hàm on: lắng nghe  |  emit: gửi đi - dùng cho cả FE và BE
  //   1. bên FE sẽ emit một sự kiện "join-room" => bên BE sẽ lắng nghe "join-room"
  socket.on("join-room", (dataGuiLen) => {
    console.log({ dataGuiLen }); // => { user_id_sender: 12, user_id_recipient: 18 }
    // -----> đặt tên cho room: dùng id của 2 user để đặt tên room. Tuy nhiên để đảm bảo 2 user vào đúng 1 room dù ai kết nối trước, thì trước khi đặt tên phải sort lại userID theo 1 thứ tự nào đó rồi mới đặt tên
    const { user_id_sender, user_id_recipient } = dataGuiLen;

    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");

    console.log("roomId >>", roomId);

    // thoát room cũ trước khi join mới
    socket.rooms.forEach((roomId) => {
      socket.leave(roomId);
    });

    // join room mới
    socket.join(roomId);

    // 2. FE emit sự kiện 'send-message' => BE on sự kiện 'send-message'
    socket.on("send-message", async (data) => {
      console.log({ data }); //=> { message: 'sdsdsd', user_id_sender: 12, user_id_recipient: 19 }
      //   ---> tạo room => gửi message vào
      const { user_id_sender, user_id_recipient, message } = data;

      const roomId = [user_id_sender, user_id_recipient]
        .sort((a, b) => a - b)
        .join("_");
      // ---> BE emit lại cho FE sự kiện 'receive-message'. FE sẽ chạy on để "Lắng nghe tin nhắn từ server"
      io.to(roomId).emit("receive-message", data);

      // lưu message vào db
      await prisma.chats.create({
        data: {
          message,
          user_id_sender,
          user_id_recipient,
        },
      });
    });
  }); //end join-room  > send-mesage > receive-message

  // get list message từ db
  socket.on("get-list-message", async (data) => {
    console.log("get-list-message>>", data);
    const { user_id_sender, user_id_recipient } = data;
    const chats = await prisma.chats.findMany({
      where: {
        user_id_sender: { in: [user_id_sender, user_id_recipient] },
        user_id_recipient: { in: [user_id_sender, user_id_recipient] },
      },
    });
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");

    // gửi list mesage vào room chat
    io.to(roomId).emit("get-list-message", chats);
    // nếu lỗi sắp xếp tin nhắn => thử cái này
    // socket.emit("get-list-message", chats);
  });
};

export default chatSocket;
