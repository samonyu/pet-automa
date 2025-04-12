const bcrypt = require('bcrypt');

// 替换为你需要加密的密码
const plaintextPassword = '123a';

bcrypt.hash(plaintextPassword, 10, (err, hash) => {
  if (err) {
    console.error('密码加密失败:', err);
    return;
  }
  console.log('加密后的密码:', hash);
});
