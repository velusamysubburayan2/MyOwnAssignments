/*
Testing two users simultaneously
Scenario: You are testing a chat application. User A sends a message to User B. 
You need to open two independent browser sessions in the same test.
How will you do it?
Answer:
Create two separate browser contexts.
*/

import { test } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { HomePage } from '../PageObjects/HomePage';
import { EventsPage } from '../PageObjects/EventsPage';
import { EventResourcePage } from '../PageObjects/EventResourcePage';
import { MyBookingsPage } from '../PageObjects/MyBookingsPage';
import testData from '../Utils/testData.json' with {type: 'json'};

const jsonData = JSON.parse(JSON.stringify(testData));
test('Testing two users simultaneously', async ({ browser }) => {
    //Context-1
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.loginTo(jsonData.userName, jsonData.passWord);

    const homePage = new HomePage(page);
    await homePage.browseEventsVisible();
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/events') && response.status() === 200
        ),
        homePage.gotoEventsPage()
    ]);

    const eventsPage = new EventsPage(page);
    await eventsPage.eventsURLvisibility();
    await eventsPage.eventsShouldBeMoreThanOne();
    await Promise.all([
        page.waitForURL(/\/events\/\d+$/),
        eventsPage.bookNow(jsonData.eventTitle)
    ]);

    const eventResourcePage = new EventResourcePage(page);
    await eventResourcePage.verifyEventTitle();
    const bookingDetails = await eventResourcePage.bookEvent(jsonData.eventTitle, "Subburayan Velusamy", jsonData.userName, "9080751313");
    //Context-2
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    const loginPage1 = new LoginPage(newPage);
    await loginPage1.loginTo(jsonData.userName, jsonData.passWord);

    const homePage1 = new HomePage(newPage);
    await homePage1.browseEventsVisible();
    await Promise.all([
        newPage.waitForResponse(response =>
            response.url().includes('/bookings') && response.status() === 200
        ),
        homePage1.gotoBookingsPage()
    ])

    const myBookingsPage1 = new MyBookingsPage(newPage);
    await myBookingsPage1.verifyBookingDetails(bookingDetails);

})