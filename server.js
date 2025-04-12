const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('data.db');

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('images')); // 提供图片静态资源
app.use(
  session({
    secret: 'secret-key', // 替换为更安全的密钥
    resave: false,
    saveUninitialized: true,
  })
);

// 鉴权中间件
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
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

// 用户注册接口（仅管理员可用）
app.post('/register', isAuthenticated, isAdmin, (req, res) => {
  const { username, password, is_admin } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('密码加密错误');
    db.run(
      `INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)`,
      [username, hash, is_admin ? 1 : 0],
      function (err) {
        if (err) return res.status(500).send('数据库错误');
        res.send('用户注册成功');
      }
    );
  });
});

// 获取所有用户（仅管理员可用）
app.get('/users', isAuthenticated, isAdmin, (req, res) => {
  db.all('SELECT id, username, is_admin FROM users', (err, rows) => {
    if (err) return res.status(500).send('数据库错误');
    res.json(rows);
  });
});

// 删除用户（仅管理员可用）
app.delete('/users/:id', isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).send('数据库错误');
    res.send('用户删除成功');
  });
});

// 获取所有视频
app.get('/videos', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM videos', (err, rows) => {
    if (err) return res.status(500).send('数据库错误');
    res.json(rows);
  });
});

// 新增视频（仅管理员可用）
app.post('/videos', isAuthenticated, isAdmin, (req, res) => {
  const { jid, jimg, jtitle } = req.body;
  db.run(
    `INSERT INTO videos (jid, jimg, jtitle) VALUES (?, ?, ?)`,
    [jid, jimg, jtitle],
    function (err) {
      if (err) return res.status(500).send('数据库错误');
      res.send('视频新增成功');
    }
  );
});

// 更新视频（仅管理员可用）
app.put('/videos/:id', isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;
  const { jid, jimg, jtitle } = req.body;
  db.run(
    `UPDATE videos SET jid = ?, jimg = ?, jtitle = ? WHERE id = ?`,
    [jid, jimg, jtitle, id],
    function (err) {
      if (err) return res.status(500).send('数据库错误');
      res.send('视频更新成功');
    }
  );
});

// 删除视频（仅管理员可用）
app.delete('/videos/:id', isAuthenticated, isAdmin, (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM videos WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).send('数据库错误');
    res.send('视频删除成功');
  });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，访问 http://localhost:${PORT}`);
});