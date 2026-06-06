import * as SQLite from 'expo-sqlite';

import { sqliteStorage } from './sqliteStorage';

export const getItem    = sqliteStorage.getItem;
export const setItem    = sqliteStorage.setItem;
export const removeItem = sqliteStorage.removeItem;

export async function clearStratusStorage(): Promise<void> {
  try {
    const db = SQLite.openDatabaseSync('stratus.db');
    const rows = db.getAllSync<{ key: string }>(
      "SELECT key FROM kv WHERE key LIKE 'stratus:%'"
    );
    for (const { key } of rows) {
      db.runSync('DELETE FROM kv WHERE key = ?', [key]);
    }
  } catch {
    // Non-fatal
  }
}
