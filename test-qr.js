const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console messages and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('https://thaiboxer-companion.cloud');
  
  // Wait a bit for JS to execute
  await page.waitForTimeout(3000);
  
  // Check if QR code element exists
  const qrElement = await page.$('#qr-code');
  console.log('QR element found:', !!qrElement);
  
  // Check if it has children (the canvas)
  if (qrElement) {
    const hasCanvas = await page.$('#qr-code canvas');
    console.log('QR canvas found:', !!hasCanvas);
  }
  
  // Take a screenshot
  await page.screenshot({ path: '/tmp/qr-test.png', fullPage: true });
  console.log('Screenshot saved to /tmp/qr-test.png');
  
  await browser.close();
})();
