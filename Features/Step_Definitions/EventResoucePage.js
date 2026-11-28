import { When, Then } from "@cucumber/cucumber";
When('Enter Mandatory Details and Book an event-Capture Booking Ref,tickets,price', async function () {
  await this.page.waitForLoadState('networkidle');
  this.bookDetails = await this.eventResourcePage.bookEvent(this.firstEventTitle, 'Subburayan', 'mvsrayan1@gmail.com', '9080751313');
  console.log(this.bookDetails);
});

When('Go to my Bookings',async function () {
  await this.eventResourcePage.goToMyBookings();
  await this.page.waitForURL('**/bookings');
});