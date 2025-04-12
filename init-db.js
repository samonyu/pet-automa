const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

// 初始化用户表和视频表
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_admin INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jid TEXT NOT NULL UNIQUE,
      jimg TEXT NOT NULL,
      jtitle TEXT NOT NULL
    )
  `);

  console.log('数据库初始化完成');
});

db.close();