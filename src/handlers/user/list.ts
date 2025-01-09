import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../schema";

export const listUsersHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const user = c.get("user");
    console.log("認証されたユーザー:", user);

    const db = drizzle(c.env.DB);
    const result = await db.select().from(users);

    return c.json({
      success: true,
      users: result,
      authenticatedUser: {
        uid: user.uid,
        email: user.email,
        is_admin:
          result.find((u) => u.firebase_uid === user.uid)?.is_admin || 0,
      },
    });
  } catch (error) {
    console.error(
      "エラー:",
      error instanceof Error ? error.message : String(error)
    );
    return c.json({ error: "Internal server error" }, 500);
  }
};
