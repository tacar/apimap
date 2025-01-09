export const schemas = {
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
};
