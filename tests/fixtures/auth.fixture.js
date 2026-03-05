import { test as base, expect } from '@playwright/test';
import fs from 'fs';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/');

    if (page.url().includes('/login')) {
      console.log('Token expired. Re-login required.');
      throw new Error('Auth expired. Re-run auth.setup.ts');
    }

    await use(page);
  },
});