// types.ts
import { z } from "zod";
import { Context as HonoContext, ValidationTargets } from "hono";

export const UserSchema = z.object({
  id: z.number(),
  firebase_uid: z.string().nullable(),
  is_admin: z.number(),
  avatar: z.number().nullable(),
  gid: z.string().nullable(),
  name: z.string(),
  email: z.string().email(),
  email_verified_at: z.string().nullable(),
  password: z.string(),
  remember_token: z.string().nullable(),
  token: z.string().nullable(),
  nickname: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const UsersResponseSchema = z.object({
  success: z.boolean(),
  users: z.array(UserSchema),
});

export const QuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export interface Bindings {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_STORAGE_BUCKET: string;
  DEEPSEEK_API_URL: string;
  ALLOWED_ORIGINS: string;
  NODE_ENV: string;
  TURSO_DB_URL: string;
  R2: R2Bucket;
}

export interface Variables {
  // 必要に応じて追加
}

export type Context = HonoContext<{ Bindings: Bindings }>;

export type ValidatedContext = Context & {
  req: {
    valid: <T extends keyof ValidationTargets>(
      target: T
    ) => ValidationTargets[T];
  };
};
