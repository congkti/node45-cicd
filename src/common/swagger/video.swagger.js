const video = {
  "/video/video-list": {
    get: {
      tags: ["Videos"],
      responses: {
        200: {
          description: "OKe",
        },
      },
    },
  },

  "/video/video-list/{id}": {
    get: {
      security: [
        {
          longToken: [],
        },
      ],
      tags: ["Videos"],
      responses: {
        200: {
          description: "OKe",
        },
      },
      parameters: [
        {
          name: "page",
          in: "query",
        },
        {
          name: "x-access-token",
          in: "header",
        },
        {
          name: "id",
          in: "path",
        },
      ],
    },
  },

  //   truyền body
  "/video/video-create": {
    post: {
      security: [
        {
          longToken: [],
        },
      ],
      tags: [`Videos`],
      responses: {
        200: {
          description: `oke`,
        },
      },

      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                age: { type: "number" },
                description: { type: "string" },
              },
            },
          },
        },
      },
    },
  },

  //   truyền file
  "/video/video-update": {
    post: {
      security: [
        {
          longToken: [],
        },
      ],
      tags: [`Videos`],
      responses: {
        200: {
          description: `oke`,
        },
      },
      requestBody: {
        content: {
          "multipart/from-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: `string` },
                file: {
                  type: `file`,
                  formart: `binary`,
                },
                files: {
                  type: `array`,
                  items: {
                    type: `file`,
                    formart: `binary`,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default video;
