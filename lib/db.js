import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Tiny JSON-file database so the project runs with zero setup.
 * Swap this module for Prisma/Postgres/etc. in production – every
 * other file talks to the `db` object below only.
 */
const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const empty = () => ({ users: [], attempts: [], messages: [] });

function load() {
  try {
    return { ...empty(), ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) };
  } catch {
    return empty();
  }
}

function save(data) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE); // atomic swap
}

export const uid = () => crypto.randomUUID();

export const db = {
  findUserByEmail(email) {
    return load().users.find((u) => u.email === email) || null;
  },

  findUserById(id) {
    return load().users.find((u) => u.id === id) || null;
  },

  createUser({ name, email, passwordHash, targetExam }) {
    const data = load();
    const user = {
      id: uid(),
      name,
      email,
      passwordHash,
      targetExam,
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
    save(data);
    return user;
  },

  addAttempt(attempt) {
    const data = load();
    data.attempts.push(attempt);
    save(data);
    return attempt;
  },

  getAttempt(id) {
    return load().attempts.find((a) => a.id === id) || null;
  },

  /** Newest first. */
  listAttempts(userId) {
    return load()
      .attempts.filter((a) => a.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  addMessage(message) {
    const data = load();
    data.messages.push({ id: uid(), createdAt: new Date().toISOString(), ...message });
    save(data);
  },
};
