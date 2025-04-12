const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('data.db');

// 中间件配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret-key', // 替换为更安全的密钥
    resave: false,
    saveUninitialized: true,
  })
);

// 初始化数据库
db.serialize(() => {
  // 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_admin INTEGER NOT NULL DEFAULT 0
    )
  `);

  // 记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL
    )
  `);

  // 插入一个默认管理员账号（如果不存在）
  db.get(`SELECT * FROM users WHERE username = 'admin'`, (err, user) => {
    if (!user) {
      bcrypt.hash('admin_password', 10, (err, hash) => {
        if (err) throw err;
        db.run(
          `INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)`,
          ['admin', hash, 1]
        );
        console.log('默认管理员账号已创建，用户名: admin, 密码: admin_password');
      });
    }
  });
});

// 鉴权中间件
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.status(401).send('未授权，请先登录');
}

// 管理员权限验证中间件
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.is_admin === 1) {
    return next();
  }
  res.status(403).send('无管理员权限');
}

// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).send('数据库错误');
    if (!user) return res.status(404).send('用户不存在');

    bcrypt.compare(password, user.password, (err, same) => {
      if (err) return res.status(500).send('密码验证错误');
      if (same) {
        req.session.user = { id: user.id, username: user.username, is_admin: user.is_admin };
        res.send('登录成功');
      } else {
        res.status(401).send('密码错误');
      }
    });
  });
});

// 登出接口
app.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('登出失败');
    res.send('登出成功');
  });
});

// 获取所有记录
app.get('/records', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM records', (err, rows) => {
    if (err) return res.status(500).send('数据库错误');
    res.json(rows);
  });
});

// 添加记录
app.post('/records', isAuthenticated, isAdmin, (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).send('内容不能为空');
  }

  db.run('INSERT INTO records (content) VALUES (?)', [content], function (err) {
    if (err) return res.status(500).send('数据库错误');
    res.send({ id: this.lastID, content });
  });
});

// 修改记录
app.put('/records/:id', isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).send('内容不能为空');
  }

  db.run('UPDATE records SET content = ? WHERE id = ?', [content, id], function (err) {
    if (err) return res.status(500).send('数据库错误');
    if (this.changes === 0) return res.status(404).send('记录不存在');
    res.send('记录更新成功');
  });
});

// 删除记录
app.delete('/records/:id', isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM records WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).send('数据库错误');
    if (this.changes === 0) return res.status(404).send('记录不存在');
    res.send('记录删除成功');
  });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，访问 http://localhost:${PORT}`);
});