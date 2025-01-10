import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings, Variables } from "./types";

// ルートのインポート
import userRoutes from "./routes/user";
import todoRoutes from "./routes/todo";
import imagesRoutes from "./routes/images";
import deepseekRoutes from "./routes/deepseek";
import wordsRoutes from "./routes/words";

// OpenAPIスキーマの定義
const openApiSchema = {
  openapi: "3.0.3",
  info: {
    title: "API Map Documentation",
    version: "1.0.0",
    description: "API Documentation",
  },
  servers: [
    {
      url: "https://apimap.tacarz.workers.dev",
      description: "Production server",
    },
    {
      url: "http://localhost:8787",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Todo",
      description: "Todo management endpoints",
    },
    {
      name: "Images",
      description: "Image management endpoints",
    },
    {
      name: "Words",
      description: "Word management endpoints",
    },
    {
      name: "Deepseek",
      description: "Deepseek AI chat endpoints",
    },
  ],
  paths: {
    "/api/users/add": {
      post: {
        summary: "Register a new user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                  },
                  name: {
                    type: "string",
                    minLength: 1,
                  },
                },
                required: ["email", "password", "name"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    error: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/login": {
      post: {
        summary: "User login",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    token: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    error: {
                      type: "string",
                      example: "Invalid credentials",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/list": {
      get: {
        summary: "Get all users",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    users: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/UserData",
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    error: {
                      type: "string",
                      example: "Failed to fetch users",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/search": {
      post: {
        summary: "Search user by email",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Search result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    exists: {
                      type: "boolean",
                    },
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    error: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/lastlogin": {
      put: {
        summary: "Update user's last login time",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Last login time updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    message: {
                      type: "string",
                    },
                    data: {
                      type: "object",
                      properties: {
                        email: {
                          type: "string",
                        },
                        last_login_at: {
                          type: "string",
                          format: "date-time",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    error: {
                      type: "string",
                      example: "User not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/todos": {
      get: {
        summary: "Get all todos",
        tags: ["Todo"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of todos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Todo" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new todo",
        tags: ["Todo"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TodoInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Todo created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TodoResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/todos/{id}": {
      get: {
        summary: "Get a todo by ID",
        tags: ["Todo"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Todo details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TodoResponse",
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a todo",
        tags: ["Todo"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TodoInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Todo updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TodoResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a todo",
        tags: ["Todo"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Todo deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/images/upload": {
      post: {
        summary: "Upload an image",
        tags: ["Images"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Image uploaded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    url: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/images/{id}": {
      get: {
        summary: "Get an image",
        tags: ["Images"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Image file",
            content: {
              "image/*": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
    },
    "/api/words": {
      get: {
        summary: "Get all words",
        tags: ["Words"],
        responses: {
          "200": {
            description: "List of words",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Word" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new word",
        tags: ["Words"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/WordInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Word created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/WordResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/deepseek/v1/chat/completions": {
      post: {
        summary: "Create chat completion",
        tags: ["Deepseek"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  messages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: {
                          type: "string",
                          enum: ["system", "user", "assistant"],
                        },
                        content: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Chat completion response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    choices: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          message: {
                            type: "object",
                            properties: {
                              role: { type: "string" },
                              content: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      UserResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          data: {
            $ref: "#/components/schemas/UserData",
          },
        },
      },
      UserData: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          email: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
      },
      Todo: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          completed: { type: "boolean" },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TodoInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          completed: { type: "boolean" },
        },
        required: ["title"],
      },
      TodoResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { $ref: "#/components/schemas/Todo" },
        },
      },
      Word: {
        type: "object",
        properties: {
          id: { type: "string" },
          word: { type: "string" },
          meaning: { type: "string" },
          example: { type: "string" },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      WordInput: {
        type: "object",
        properties: {
          word: { type: "string" },
          meaning: { type: "string" },
          example: { type: "string" },
        },
        required: ["word"],
      },
      WordResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { $ref: "#/components/schemas/Word" },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ミドルウェアの設定
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "https://yourdomain.com",
      "https://oboete.pages.dev",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", logger());
app.use("*", prettyJSON());

// OpenAPIドキュメントの提供
app.get("/doc", (c) => {
  return c.json(openApiSchema);
});

// Swagger UIのセットアップ
app.get("/ui", swaggerUI({ url: "/doc" }));

// APIルートのマウント
app.route("/api/users", userRoutes);
app.route("/api/todos", todoRoutes);
app.route("/api/images", imagesRoutes);
app.route("/api/deepseek", deepseekRoutes);
app.route("/api/words", wordsRoutes);

// ヘルスチェック
app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
