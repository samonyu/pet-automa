const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // headless: true for background mode
  const page = await browser.newPage();

  // 1. 打开页面
  await page.goto('https://www.javlibrary.com/cn/', { waitUntil: 'networkidle2' });

  // 2. 判断是否有“我已满18岁”按钮并点击
  const agreeButton = await page.$('input.btnAdultAgree');
  if (agreeButton) {
    await agreeButton.click();
    await page.waitForTimeout(1000);
  }

  // 3. 抓取视频数据
  const results = await page.$$eval('div.videos > div', (elements) => {
    return elements.slice(0, 10).map((el) => {
      const idDiv = el.querySelector('div.id');
      const img = el.querySelector('img');
      return {
        jid: idDiv ? idDiv.innerText.trim() : '',
        jimg: img ? img.src : ''
      };
    });
  });

  // 4. 写入 JSON 文件
  fs.writeFileSync('jtable.txt', JSON.stringify(results, null, 2), 'utf8');
  console.log('抓取完成，结果保存在 jtable.txt');

  await browser.close();
})();
