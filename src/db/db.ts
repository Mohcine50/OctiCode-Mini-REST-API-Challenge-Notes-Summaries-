import path from 'path';
import DatabaseService from './database';

const getDb = (dbPath: string = path.join(process.cwd(), 'data', 'app.db')) => {
  const db = new DatabaseService(dbPath);
  return db;
};

export default getDb;
