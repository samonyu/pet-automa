const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// 添加隐身插件
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  // 设置 User-Agent 和浏览器头部，模仿真实用户
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  // 打开目标页面
  try {
    await page.goto('https://www.javlibrary.com/cn/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('页面打开成功，等待手动验证...');
  } catch (error) {
    console.log('页面加载失败，请检查网络连接或目标网址是否有效。');
    await browser.close();
    return;
  }

  // 等待验证通过后的关键元素加载
  try {
    await page.waitForSelector('div.videos', { timeout: 60000 }); // 等待页面特定元素加载
    console.log('页面加载完成！');
  } catch (error) {
    console.log('页面加载超时，可能未通过 Cloudflare 验证。');
    await browser.close();
    return;
  }

  // 抓取页面数据
  const results = await page.$$eval('div.videos > div', (elements) => {
    return elements.map((el) => {
      const idDiv = el.querySelector('div.id');
      const img = el.querySelector('img');
      return {
        jid: idDiv ? idDiv.innerText.trim() : '',
        jimg: img ? img.src : ''
      };
    });
  });

  // 输出抓取结果
  console.log('抓取的数据：', results);

  await browser.close();
})();