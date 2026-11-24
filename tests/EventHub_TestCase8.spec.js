/*
Don't use POM
1.Login to the application using Storage State.
2.Verify Browser Events is visible, Avaliable events are more than 1.
3.Click API docs Button on the DashBoard.
4.Verify 'EventHub API' header is visible, Url contains '/docs'.
5.Go back to the original Page.
6.Verify 'EventHub'header is visible.
*/
import { test, expect, chromium } from '@playwright/test';
import testData from '../Utils/testData.json' with {type: 'json'};

const jsonData = JSON.parse(JSON.stringify(testData));
test.beforeAll(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://eventhub.rahulshettyacademy.com/');
    await page.getByPlaceholder('you@email.com').fill(jsonData.userName);
    await page.locator("[name='password']").fill(jsonData.passWord);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForLoadState('networkidle');
    await page.context().storageState({ path: 'State.json' });
    await browser.close();
});

test('Validate the new page Data', async ({browser}) => {

    const context=await browser.newContext({storageState:'State.json'});
    const page=await context.newPage();
    await page.goto('https://eventhub.rahulshettyacademy.com/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Browse Events →')).toBeVisible();
    const count=await page.getByTestId('event-card').count();
    expect(count).toBeGreaterThan(1);

    const [apiDocPage]=await Promise.all([
        page.waitForEvent('popup'),
        page.getByRole('link',{name:'API Docs'}).click()
    ])

    await apiDocPage.waitForURL(/\/api\/docs\/$/);
    await expect(apiDocPage).toHaveURL(/\/api\/docs\/$/)
    await expect(apiDocPage.getByText('EventHub API')).toBeVisible();
    // apiDocPage.close(); 

    await page.bringToFront();
    await expect(page.locator('.tracking-tight').first()).toBeVisible();

});