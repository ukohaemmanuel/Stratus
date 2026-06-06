import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    _db = SQLite.openDatabaseSync('stratus.db');
    _db.execSync(
      'CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)'
    );
  }
  return _db;
}

export const sqliteStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const row = getDb().getFirstSync<{ value: string }>(
        'SELECT value FROM kv WHERE key = ?',
        [key]
      );
      return row?.value ?? null;
    } catch {
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      getDb().runSync(
        'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)',
        [key, value]
      );
    } catch {
      // Non-fatal — app works with stale/missing data
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      getDb().runSync('DELETE FROM kv WHERE key = ?', [key]);
    } catch {
      // Non-fatal
    }
  },
};
