import prisma from "../prisma/init.prisma.js";

// The root provides a resolver function for each API endpoint
const root = {
  hello() {
    return "Hello world!";
  },
  async getListVideoType() {
    const videoTypes = await prisma.video_type.findMany();
    return videoTypes;
  },
  async createVideoType(payload) {
    // console.log(payload);
    const { type_name, icon } = payload;
    const newVideoType = await prisma.video_type.create({
      data: {
        type_name,
        icon,
      },
    });
    return newVideoType;
  },
  async updateVideotype(payload) {
    const { type_id, type_name, icon } = payload;
    const videoTypeUpdated = await prisma.video_type.update({
      where: {
        type_id,
      },
      data: {
        type_name,
        icon,
      },
    });
    return videoTypeUpdated;
  },

  async deleteVideoType(payload) {
    const { type_id } = payload;
    await prisma.video_type.delete({
      where: {
        type_id,
      },
    });
    return `Deleted Video Type #${type_id}`;
  },
};

export default root;
