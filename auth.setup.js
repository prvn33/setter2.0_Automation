// // const { chromium, request } = require('@playwright/test');

// // module.exports = async () => {
// //   // 1️⃣ Login via API
// //   const apiContext = await request.newContext({
// //     baseURL: 'https://2fagolc1t4.execute-api.us-west-2.amazonaws.com',
// //     extraHTTPHeaders: {
// //       'content-type': 'application/json',
// //     },
// //   });

// //   const response = await apiContext.post('/setterDev/adminLogin', {
// //     data: {
// //       email: process.env.ADMIN_EMAIL,
// //       password: process.env.ADMIN_PASSWORD,
// //       remember_me: 1,
// //       source: 'setter-layline',
// //       client: {
// //         id: process.env.CLIENT_ID,
// //         secret: process.env.CLIENT_SECRET,
// //       },
// //       withToken: true,
// //     },
// //   });
// //   console.log('LOGIN RESPONSE 👉', JSON.stringify(body, null, 2));

// //   if (!response.ok()) {
// //     throw new Error('❌ Admin login failed');
// //   }

// //   const body = await response.json();
// //   const token = body.token || body.accessToken;

// //   if (!token) {
// //     throw new Error('❌ Token not found in login response');
// //   }

// //   // 2️⃣ Open browser & inject token
// //   const browser = await chromium.launch();
// //   const context = await browser.newContext();
// //   const page = await context.newPage();

// //   await page.goto('https://setter-dev.yourapp.com'); // IMPORTANT: app domain

// //   await page.evaluate((token) => {
// //     localStorage.setItem('token', token); // 🔴 key must match app
// //   }, token);

// //   // 3️⃣ Save auth state
// //   await context.storageState({ path: 'admin-auth.json' });

// //   await browser.close();
// //   console.log('✅ Token injected & auth saved');
// // };


// const { chromium } = require('@playwright/test');

// module.exports = async () => {
//   const browser = await chromium.launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   await page.goto('https://stage.setter.layline.live'); // MUST be app domain

//   await page.evaluate(() => {
//     localStorage.setItem(
//       'persist:adminLogin',
//       'U2FsdGVkX1/4mlsKntribyKVEkDnJ6Xs5gIpWY0z2abpiT++9PT2K7vQFTNnxQ64jp6d9HqIgS7W5caCzMhPL0u4uHQ0yPD3MTlbb6xFTCH0gaFkDJpfd78P+YLUwBAjw7TU0fRyYfrwSdCeDJYfDe4DXUswpWlInEWpRyaRI8FXnGtmH/1JCSLGU+h/PZg7'
//     );
//   });

//   await context.storageState({ path: 'admin-auth.json' });
//   await browser.close();

//   console.log('✅ Redux-persist admin login injected');
// };




import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('global login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('bantony@layline.live', 'Deepdive2@2!');

  // ✅ WAIT FOR CONFIRMED LOGIN STATE
  await page.waitForURL('**/patients');
  await expect(page.getByRole('link', { name: 'Schedulers' })).toBeVisible();

  // ✅ SAVE ONLY AFTER LOGIN IS CONFIRMED
  await page.context().storageState({ path: 'admin-auth.json' });
});