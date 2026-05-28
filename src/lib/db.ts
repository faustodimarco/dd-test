import Database from 'better-sqlite3';
import path from 'path';
import { INDIVIDUAL_IDS } from './personas';

const DB_PATH = path.join(process.cwd(), 'chat.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  initSchema(_db);
  seedConversations(_db);
  return _db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id          TEXT PRIMARY KEY,
      persona_id  TEXT NOT NULL,
      updated_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id  TEXT NOT NULL,
      role             TEXT NOT NULL,
      content          TEXT NOT NULL,
      created_at       INTEGER NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );
  `);

  // Migration: add responder_id column (no-op if already exists)
  try {
    db.exec('ALTER TABLE messages ADD COLUMN responder_id TEXT');
  } catch (_) {
    // column already exists — ignore
  }
}

function seedConversations(db: Database.Database): void {
  const allIds = [...INDIVIDUAL_IDS, 'group'];
  const insert = db.prepare(`
    INSERT OR IGNORE INTO conversations (id, persona_id, updated_at)
    VALUES (?, ?, ?)
  `);
  const now = Date.now();
  for (const id of allIds) {
    insert.run(id, id, now);
  }
}

export interface DbMessage {
  id: number;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  responder_id: string | null;
  created_at: number;
}

export interface ConversationSummary {
  id: string;
  persona_id: string;
  updated_at: number;
  last_message: string | null;
  last_role: string | null;
}

export function getMessages(conversationId: string, limit = 20): DbMessage[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(conversationId, limit) as DbMessage[];
  return rows.reverse();
}

export function getAllMessages(conversationId: string): DbMessage[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`
    )
    .all(conversationId) as DbMessage[];
}

export function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  responderId?: string
): void {
  const db = getDb();
  const now = Date.now();
  db.prepare(
    `INSERT INTO messages (conversation_id, role, content, responder_id, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(conversationId, role, content, responderId ?? null, now);

  db.prepare(
    `UPDATE conversations SET updated_at = ? WHERE id = ?`
  ).run(now, conversationId);
}

export function clearMessages(conversationId: string): void {
  const db = getDb();
  db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(conversationId);
  db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(Date.now(), conversationId);
}

export function getConversationsList(): ConversationSummary[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT c.id, c.persona_id, c.updated_at,
              m.content AS last_message, m.role AS last_role
       FROM conversations c
       LEFT JOIN messages m ON m.id = (
         SELECT id FROM messages
         WHERE conversation_id = c.id
         ORDER BY created_at DESC LIMIT 1
       )
       ORDER BY c.updated_at DESC`
    )
    .all() as ConversationSummary[];
}
