import { Before, After } from '@cucumber/cucumber';
import { chromium } from 'playwright';

Before(async function () {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    this.page=await context.newPage();
})