import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
Then('Capture and compare eventTitles with captured homepage eventTitles', async function () {
    await this.page.waitForLoadState('networkidle');
    await this.page.getByTestId('event-card').first().waitFor();
    await this.eventsPage.eventsShouldBeMoreThanOne();
    await expect(this.page.locator("article[data-testid='event-card'] h3")).toHaveText(this.eventTitles);
    console.log(this.eventTitles);
});

When('Click Book Now button to book an event', async function () {
    this.firstEventTitle = await this.page.locator("article[data-testid='event-card'] h3").last().textContent();
    await this.eventsPage.bookNow(this.firstEventTitle);
    await this.page.waitForURL('**/events/*');
});