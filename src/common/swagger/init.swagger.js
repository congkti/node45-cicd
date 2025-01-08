import video from "./video.swagger.js";

const swaggerDocument = {
  openapi: "3.1.0",
  info: {
    title: "Document API CyberMedia",
    version: "1.0.0",
    // summary: "A short summary of the API.",
    // description: "Đây là swagger cho BE Cyber Media....",
    // termsOfService: "http://sampleURL.com",
  },
  servers: [
    {
      url: "http://localhost:3069",
      description: "Server dưới local",
    },
    {
      url: "http://yourVPS.com",
      description: "Server dưới đã deploy",
    },
  ],
  components: {
    securitySchemes: {
      // khai báo các sơ đồ bảo mật: "apiKey", "http", "mutualTLS", "oauth2", "openIdConnect"
      //   Dùng cho case nhập token
      longToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  //   path của tất cả các API
  paths: {
    ...video,
  },
};

export default swaggerDocument;

// TEMPLATE FOR INFO OBJECT
// {
//   "title": "Sample Pet Store App",
//   "summary": "A pet store manager.",
//   "description": "This is a sample server for a pet store.",
//   "termsOfService": "https://example.com/terms/",
//   "contact": {
//     "name": "API Support",
//     "url": "https://www.example.com/support",
//     "email": "support@example.com"
//   },
//   "license": {
//     "name": "Apache 2.0",
//     "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
//   },
//   "version": "1.0.1"
// }

// TEMPLATE OF SERVER OBJ
// {
//   "servers": [
//     {
//       "url": "https://development.gigantic-server.com/v1",
//       "description": "Development server"
//     },
//     {
//       "url": "https://staging.gigantic-server.com/v1",
//       "description": "Staging server"
//     },
//     {
//       "url": "https://api.gigantic-server.com/v1",
//       "description": "Production server"
//     }
//   ]
// }

// TEMPLATE FOR components
// "components": {
//   "schemas": {
//     "GeneralError": {
//       "type": "object",
//       "properties": {
//         "code": {
//           "type": "integer",
//           "format": "int32"
//         },
//         "message": {
//           "type": "string"
//         }
//       }
//     },
//     "Category": {
//       "type": "object",
//       "properties": {
//         "id": {
//           "type": "integer",
//           "format": "int64"
//         },
//         "name": {
//           "type": "string"
//         }
//       }
//     },
//     "Tag": {
//       "type": "object",
//       "properties": {
//         "id": {
//           "type": "integer",
//           "format": "int64"
//         },
//         "name": {
//           "type": "string"
//         }
//       }
//     }
//   },
//   "parameters": {
//     "skipParam": {
//       "name": "skip",
//       "in": "query",
//       "description": "number of items to skip",
//       "required": true,
//       "schema": {
//         "type": "integer",
//         "format": "int32"
//       }
//     },
//     "limitParam": {
//       "name": "limit",
//       "in": "query",
//       "description": "max records to return",
//       "required": true,
//       "schema" : {
//         "type": "integer",
//         "format": "int32"
//       }
//     }
//   },
//   "responses": {
//     "NotFound": {
//       "description": "Entity not found."
//     },
//     "IllegalInput": {
//       "description": "Illegal input for operation."
//     },
//     "GeneralError": {
//       "description": "General Error",
//       "content": {
//         "application/json": {
//           "schema": {
//             "$ref": "#/components/schemas/GeneralError"
//           }
//         }
//       }
//     }
//   },
//   "securitySchemes": {
//     "api_key": {
//       "type": "apiKey",
//       "name": "api_key",
//       "in": "header"
//     },
//     "petstore_auth": {
//       "type": "oauth2",
//       "flows": {
//         "implicit": {
//           "authorizationUrl": "https://example.org/api/oauth/dialog",
//           "scopes": {
//             "write:pets": "modify pets in your account",
//             "read:pets": "read your pets"
//           }
//         }
//       }
//     }
//   }
// }
