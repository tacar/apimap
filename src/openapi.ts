export const openApiSchema = {
  openapi: "3.0.3",
  info: {
    title: "Todo API Documentation",
    version: "1.0.0",
    description: "Todo and User Management API",
  },
  servers: [
    {
      url: "https://apiwalk.tacarz.workers.dev",
      description: "Production server",
    },
    {
      url: "http://localhost:8787",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Users", description: "User management endpoints" },
    { name: "Todo", description: "Todo management endpoints" },
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
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  name: { type: "string", minLength: 1 },
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
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
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
                    success: { type: "boolean" },
                    token: { type: "string" },
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
                    success: { type: "boolean" },
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/UserResponse" },
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
        summary: "Check if user exists",
        description: "Check if a user is registered with the given email",
        tags: ["Users"],
        requestBody: {
          required: true,
          description: "Search criteria",
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
                    success: { type: "boolean" },
                    exists: { type: "boolean" },
                    message: { type: "string" },
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
        description: "Updates the last login timestamp for a specified user",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          description: "User email",
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
            description: "Last login time updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        email: { type: "string" },
                        last_login_at: { type: "string", format: "date-time" },
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
                      items: { $ref: "#/components/schemas/TodoResponse" },
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
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  due_date: { type: "string", format: "date-time" },
                  priority: { type: "number" },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Todo created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TodoResponse" },
              },
            },
          },
        },
      },
    },
    "/api/todos/{id}": {
      get: {
        summary: "Get a specific todo",
        tags: ["Todo"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Todo details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TodoResponse" },
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
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  is_completed: { type: "number" },
                  due_date: { type: "string", format: "date-time" },
                  priority: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Todo updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TodoResponse" },
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
            schema: { type: "integer" },
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
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        deleted_at: { type: "string", format: "date-time" },
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
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              id: { type: "number" },
              email: { type: "string" },
              name: { type: "string" },
            },
          },
        },
      },
      TodoResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              description: { type: "string" },
              is_completed: { type: "number" },
              due_date: { type: "string", format: "date-time" },
              priority: { type: "number" },
            },
          },
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
