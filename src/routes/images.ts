import { Hono } from "hono";
import { Bindings, Variables } from "../types";
import { authMiddleware } from "../middleware/auth";
import { uploadImageHandler } from "../handlers/images/upload";
import { getImageHandler } from "../handlers/images/get";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.post("/upload", authMiddleware, uploadImageHandler);
app.get("/:id", authMiddleware, getImageHandler);

export default app;
