import { test, expect } from '@playwright/test';
import testData from '../Utils/testData.json' with {type :'json'};
import { LoginPage } from '../PageObjects/LoginPage';
import { HomePage } from '../PageObjects/HomePage';
import { EventsPage } from '../PageObjects/EventsPage';
import { EventResourcePage } from '../PageObjects/EventResourcePage';
import { MyBookingsPage } from '../PageObjects/MyBookingsPage';

const jsonData = JSON.parse(JSON.stringify(testData));
test('Validate the Booking confirmation', async function ({ page }) {
    console.log('1.Login to the application with valid username and password.')
    const loginPage =new LoginPage(page);
    await loginPage.loginTo(jsonData.userName, jsonData.passWord);

    console.log('2.Verify Browse Events button present in the home page or not.')
    const homePage = new HomePage(page);
    await homePage.browseEventsVisible();

    console.log('3.Click Browse Events button , get the url of the page and verify /events is present in it.'
        + 'And also verify atlease one event should be present')
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/events') && response.status() === 200
        ),
        homePage.gotoEventsPage()
    ]);
    const eventsPage =  new EventsPage(page);
    await eventsPage.eventsURLvisibility();
    await eventsPage.eventsShouldBeMoreThanOne();

    console.log('4.Pick one event and Click Book now button.')
    await Promise.all([
        page.waitForURL(/\/events\/\d+$/),
        eventsPage.bookNow(jsonData.eventTitle)
    ]);

    console.log('5.verify the Event title in the page.Enter all the details with 2 tickets and confirm booking then verify booking confirmed text is present or not,' +
        'Get booking ref,price,tickets.')
    const eventResourcePage =  new EventResourcePage(page);
    const bookingDetails = await eventResourcePage.bookEvent(jsonData.eventTitle, "Subburayan Velusamy", jsonData.userName, "9080751313");

    console.log('6.CLick view my bookings,verify booking ref,price,tickets.')
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/bookings') && response.status() === 200
        ),
        eventResourcePage.goToMyBookings()
    ])

    const myBookingsPage = new MyBookingsPage(page);
    await myBookingsPage.verifyBookingDetails(bookingDetails);

})