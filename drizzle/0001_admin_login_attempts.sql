CREATE TABLE IF NOT EXISTS `admin_login_attempts` (
  `login_key` text PRIMARY KEY NOT NULL,
  `failures` integer DEFAULT 0 NOT NULL,
  `blocked_until` integer DEFAULT 0 NOT NULL,
  `updated_at` integer NOT NULL
);
