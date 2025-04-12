const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

// SQLite 数据库初始化
const db = new sqlite3.Database('data.db');

// 创建数据表（如果不存在）
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jid TEXT NOT NULL UNIQUE,
      jimg TEXT NOT NULL,
      jtitle TEXT NOT NULL
    )
  `);
});

// 从 jtable.json 中读取数据
const data = JSON.parse(fs.readFileSync('jtable.json', 'utf8'));

// 下载图片函数
async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('finish', () => resolve())
      .on('error', (e) => reject(e));
  });
}

// 导入数据并下载图片
(async () => {
  for (const video of data) {
    const imgPath = path.join(__dirname, 'images', `${video.jid}.jpg`);
    try {
      // 插入数据到数据库（如果 jid 已存在，则跳过）
      db.run(
        `INSERT OR IGNORE INTO videos (jid, jimg, jtitle) VALUES (?, ?, ?)`,
        [video.jid, imgPath, video.jtitle]
      );

      // 下载图片
      if (!fs.existsSync(imgPath)) {
        console.log(`下载图片: ${video.jimg}`);
        await downloadImage(video.jimg, imgPath);
      } else {
        console.log(`图片已存在，跳过下载: ${imgPath}`);
      }
    } catch (err) {
      console.error(`处理 ${video.jid} 时出错:`, err);
    }
  }

  console.log('数据导入和图片下载完成！');
  db.close();
})();
