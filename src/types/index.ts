import { DecodedIdToken } from "firebase-admin/auth";

export interface Bindings {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_API_KEY: string;
  DB: D1Database;
  R2: R2Bucket;
  R2_BUCKET: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  DEEPSEEK_API_URL: string;
  DEEPSEEK_API_KEY: string;
}

export interface Variables {
  user: DecodedIdToken;
}
