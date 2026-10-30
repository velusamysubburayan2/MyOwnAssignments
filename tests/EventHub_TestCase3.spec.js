/*
1.Login to the application with valid username and password
2.Validate the browse events text present in the page or not.
3.Click browse Events button
4.Validate the URL contains /events or not and in the page aleast on event shoul be present
5.Find one event then click book now button.
6.validate Url contains the event/ID then validate the event title same as what you click in the events page.
7.Enter all mandatory booking details and click confirm booking. store Bookref,tickets,price value.
8.Validate booking is condirmed with the text.
9.Go to my bookings.
10.validate your Booking by Booingref.Verify the details of price and ticket and eventTitle.
11.Click view Details for your booking.
12.Validate the details bookingref,price,ticket and eventTitle.
*/
import { test } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { HomePage } from '../PageObjects/HomePage';
import { EventsPage } from '../PageObjects/EventsPage';
import { EventResourcePage } from '../PageObjects/EventResourcePage';
import { MyBookingsPage } from '../PageObjects/MyBookingsPage';
import { MyBookingsDetailsPage } from '../PageObjects/MyBookingsDetailsPage';
import testData from '../Utils/testData.json' with {type: 'json'};

const jsonData = JSON.parse(JSON.stringify(testData))
test('Validate Bookings details in Bookings page', async function ({ page }) {

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
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/bookings') && response.status() === 200
        ),
        eventResourcePage.goToMyBookings()
    ])

    const myBookingsPage = new MyBookingsPage(page);
    await myBookingsPage.verifyBookingDetails(bookingDetails);
    await Promise.all([
        page.waitForURL(/\/bookings\/\d+$/),
        myBookingsPage.gotoViewDetails(bookingDetails)
    ])
    const myBookingsDetailsPage=new MyBookingsDetailsPage(page);
    myBookingsDetailsPage.verifyBookingDetails(jsonData.eventTitle,bookingDetails)

    await page.pause();


})