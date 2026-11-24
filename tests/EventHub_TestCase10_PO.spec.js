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
import { LoginPage } from '../PageObjects/LoginPage';
import { HomePage } from '../PageObjects/HomePage';
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
            const loginPage = new LoginPage(page);
            await loginPage.loginTo(userData.userName, userData.passWord);
            await page.waitForLoadState('networkidle');
            await page.waitForURL('https://eventhub.rahulshettyacademy.com/');
        })
        await test.step('validation on the homePage', async () => {
            const homepage = new HomePage(page);
            await homepage.browseEventsVisible();
            const count = await page.getByTestId('event-card').count();
            expect(count).toBeGreaterThan(1);
            await homepage.userLoginMailValidation(userData.userName)
        })
        await test.step('Logout the Application', async () => {
            const homePage = new HomePage(page);
            homePage.logout();
            await page.waitForURL(/\/login$/);
        })

    })
}
