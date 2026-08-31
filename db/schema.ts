import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const siteContent = sqliteTable('site_content', {
  id: text('id').primaryKey(),
  payload: text('payload').notNull(),
  version: integer('version').notNull().default(1),
  updatedAt: text('updated_at').notNull(),
  updatedBy: text('updated_by').notNull(),
});

export const adminLoginAttempts = sqliteTable('admin_login_attempts', {
  loginKey: text('login_key').primaryKey(),
  failures: integer('failures').notNull().default(0),
  blockedUntil: integer('blocked_until').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
});
