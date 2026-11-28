import { When,Then } from "@cucumber/cucumber";
Then('Select booked event and Verify booking Details with captured details in the previous page', async function () {
  await this.myBookingsPage.verifyBookingDetails(this.bookDetails);
});

When('Go to Admin->Manage Bookings.', async function () {
  await this.page.getByRole('button', { name: 'Admin', exact: true }).click();
  await this.page.getByRole('link', { name: 'Manage Bookings' }).click();
  await this.page.waitForURL('**/admin/bookings');
});