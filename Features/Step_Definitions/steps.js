import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../PageObjects/LoginPage.js';
import { HomePage } from '../../PageObjects/HomePage.js';
import { EventsPage } from '../../PageObjects/EventsPage.js';
import { EventResourcePage } from '../../PageObjects/EventResourcePage.js';
import { MyBookingsPage } from '../../PageObjects/MyBookingsPage.js';

Given('Login with {string} and {string}', { timeout: 10 * 1000 }, async function (userName, passWord) {
    const loginPage = new LoginPage(this.page)
    await loginPage.loginTo(userName, passWord);
});

When('Goto Events page', async function () {
    const homePage = new HomePage(this.page);
    await homePage.browseEventsVisible();
    await Promise.all([
        this.page.waitForResponse(response =>
            new URL(response.url()).pathname.endsWith('/events') && response.status() === 200
        ),
        homePage.gotoEventsPage()]);
});

Then('Verify atleast one event is present', async function () {
    const eventsPage = new EventsPage(this.page);
    await eventsPage.eventsURLvisibility();
    await eventsPage.eventsShouldBeMoreThanOne();
});

When('Select {string} event and click Book Now', async function (eventTitle) {
    const eventsPage = new EventsPage(this.page);
    await eventsPage.bookNow(eventTitle);
    const responseSpecificEvent = this.page.waitForResponse(response =>
        new URL(response.url()).pathname.match(/\/events\/([^/]+)$/) && response.status() === 200
    );
    await responseSpecificEvent;
});
let bookingDetails;
When('Enter the Booking Details {string}, {string}, {string}, {string} and Click confirm', async function (eventTitle,name,userName,phoneNumber) {
    const eventResourcePage = new EventResourcePage(this.page);
    bookingDetails = await eventResourcePage.bookEvent(eventTitle, name,userName, phoneNumber);
    await Promise.all([
        this.page.waitForResponse(response =>
            new URL(response.url()).pathname.endsWith('/bookings') && response.status() === 200
        ),
    eventResourcePage.goToMyBookings() ]);
})

Then('Verify Booking Details in My bookings page',async function (){
    const myBookingsPage = new MyBookingsPage(this.page);
    await myBookingsPage.verifyBookingDetails(bookingDetails)
})