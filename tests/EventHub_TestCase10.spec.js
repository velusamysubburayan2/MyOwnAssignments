/*
User1:mvsarayan1@gmail.com
login to the application.
verify 'Browser events ->' is visible
verify atleast one event is present in the homepage.
verify and compare the mail id present in the rightside top corner with the login usermail.
Logout.

User2:Boopalan@gmail.com
login to the application.
verify 'Browser events ->' is visible
verify atleast one event is present in the homepage.
verify and compare the mail id present in the rightside top corner with the login usermail.
Logout.
*/
import { test, expect } from '@playwright/test';
const cred = [
    {
        user: 'Subburayan',
        userName: 'mvsrayan1@gmail.com',
        passWord: 'Boopalan@231996'
    },
    {
        user: 'Boopalan',
        userName: 'Boopalan@gmail.com',
        passWord: 'Boopalan@231996'
    }]
for (let userData of cred) {
    test(`Login with user-${userData.user}`, async ({ page }) => {

        await test.step('login to the application', async () => {
            await page.goto('https://eventhub.rahulshettyacademy.com/');
            await page.getByPlaceholder('you@email.com').fill(userData.userName);
            await page.locator("[name='password']").fill(userData.passWord);
            await page.getByRole('button', { name: 'Sign In' }).click();
            await page.waitForLoadState('networkidle');
            await page.waitForURL('https://eventhub.rahulshettyacademy.com/');
        })
        await test.step('validation on the homePage', async () => {
            await expect(page.getByText('Browse Events →')).toBeVisible();
            const count = await page.getByTestId('event-card').count();
            expect(count).toBeGreaterThan(1);
            await expect(page.getByTestId('user-email-display')).toHaveText(userData.userName);
        })
        await test.step('Logout the Application',async ()=>{
            await page.getByRole('button',{name:'Logout',exact:true}).click();
            await page.waitForURL(/\/login$/);
        })

    })
}
