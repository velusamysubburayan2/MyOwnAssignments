import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Then('Select booked event and Verify booking Details', async function () {
    const manageBookingRefLoc = this.page.getByRole('row').filter({ hasText: this.bookDetails[0] });
    await expect(manageBookingRefLoc.locator('td:nth-child(4)')).toHaveText(this.bookDetails[1]);
    await expect(manageBookingRefLoc.locator('td:nth-child(5)')).toHaveText(this.bookDetails[2]);
})