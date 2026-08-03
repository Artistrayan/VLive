const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log('ROOT HTML:', rootHtml.substring(0, 200));
  
  const errorOverlayText = await page.evaluate(() => {
    const el = document.getElementById('error-overlay');
    return el ? el.innerText : 'No error overlay';
  });
  console.log('Error Overlay Text:', errorOverlayText);
  
  await browser.close();
})();
