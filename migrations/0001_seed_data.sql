INSERT INTO users (
  firebase_uid,
  is_admin,
  name,
  email,
  email_verified_at,
  created_at
) VALUES (
  'admin-uid-1',
  1,
  'Admin User',
  'admin1@example.com',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO users (
  firebase_uid,
  name,
  email,
  email_verified_at,
  created_at
) VALUES (
  'test-uid-1',
  'Test User',
  'test1@example.com',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);