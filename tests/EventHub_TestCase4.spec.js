/*
1.Login and Book an event through API.
2.Insert that token login the application with the same token.
3.Go to my bookings page and verify the event booked or not.
*/
import { test } from '@playwright/test';
import { request } from '@playwright/test';

import { APIUtils } from '../Utils/APIUtils';
import { HomePage } from '../PageObjects/HomePage';
import { MyBookingsPage } from '../PageObjects/MyBookingsPage';

const payloadCreateEvent = {
    customerEmail: "mvsrayan1@gmail.com",
    customerName: "Subburayan Velusamy",
    customerPhone: "9080751313",
    eventId: 285,
    quantity: 5
}
let response;
test.beforeAll(async function () {
    const apiContext = await request.newContext();
    const aPIUtils = new APIUtils(apiContext);
    response = await aPIUtils.createEvent(payloadCreateEvent);
    console.log(response);

})
test('API testing-Login and create Event', async ({ page }) => {
    const apiContext = await request.newContext();
    const aPIUtils = new APIUtils(apiContext);
    const token = await aPIUtils.loginToApp();

    await page.addInitScript(token => { window.localStorage.setItem('eventhub_token', token) }, token);

    await page.goto('https://eventhub.rahulshettyacademy.com/');
    const homePage = new HomePage(page);
    await homePage.browseEventsVisible();
    await Promise.all([
        page.waitForURL('**/bookings'),
        homePage.gotoBookingsPage()
    ]);

    const myBookingsPage = new MyBookingsPage(page);
    const bookingDetails=[response.data.bookingRef,response.data.quantity,response.data.totalPrice];
    await myBookingsPage.verifyBookingDetails(bookingDetails);
   

})