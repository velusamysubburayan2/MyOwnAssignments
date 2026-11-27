import { expect } from "@playwright/test";
import { When, Then } from "@cucumber/cucumber";
Then('verify Browser events  is visible', async function () {
    await  this.homePage.browseEventsVisible();
});

Then('verify atleast one event is present in the homepage',async  function () {
    const count = await this.page.getByTestId('event-card').count();
    expect(count).toBeGreaterThan(1);
});

Then('verify and compare the login user mail id {string} is present in the rightside top corner',async function (userName) {
     await  this.homePage.userLoginMailValidation(userName);
});

When('Logout the application', async function () {
    await  this.homePage.logout();
});