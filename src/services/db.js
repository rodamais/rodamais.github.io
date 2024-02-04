import Dexie from 'dexie';

export const db = new Dexie('rodamais');
db.version(1).stores({
  crachas: '++id, foto, nome, cargo' // Primary key and indexed props
});