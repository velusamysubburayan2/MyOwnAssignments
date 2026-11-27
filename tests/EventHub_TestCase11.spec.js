/*
1.Login to the application.
2.Verify atlease one event is present. Capture and store all the events present in the page to array.
3.Go to events page.
4.Capture and compare event title with previously captured events.
5.Book an event for first displayed event in the page.
6.Capture Booking Ref,tickets,price.
7.Go to my Bookings.
8.Select the booked event.Capture and compare the details with previuosly captured details on the book page.
9.Click Admin->Manage Bookings in the dashboard.
10.Select the booked event.Capture and compare the details with previuosly captured details on the book page.
*/
import { test, expect, request } from '@playwright/test';
import { APIUtils } from '../Utils/APIUtils';
import { HomePage } from '../PageObjects/HomePage';
import { EventsPage } from '../PageObjects/EventsPage';
import { EventResourcePage } from '../PageObjects/EventResourcePage';
import { MyBookingsPage } from '../PageObjects/MyBookingsPage';
test('Verify event is displayed in Admin->Manage Bookings', async ({ page },testInfo) => {

    await test.step('Login to the application', async () => {
        const apiContext = await request.newContext();
        const apiUtils = new APIUtils(apiContext);
        const token = await apiUtils.loginToApp();
        await page.addInitScript((token) => { window.localStorage.setItem('eventhub_token', token) }, token);
        await page.goto('https://eventhub.rahulshettyacademy.com/')
    })
    const homePage = new HomePage(page);
    let eventTitles;
    await test.step('Verify atlease one event is present.'
        + 'Capture and store all the events present in the page to array.', async () => {
            await homePage.browseEventsVisible();
            eventTitles = await page.locator("article[data-testid='event-card'] h3").allTextContents();
        })
    await test.step('Go to events page.', async () => {
        await homePage.gotoEventsPage();
        await page.waitForURL('**/events');
    })
    const eventsPage = new EventsPage(page);
    await test.step('Capture and compare event title with previously captured events.', async () => {
        await eventsPage.eventsShouldBeMoreThanOne();
        await expect(page.locator("article[data-testid='event-card'] h3")).toHaveText(eventTitles);
    })
    let firstEventTitle;
    await test.step('Book an event for first displayed event in the page', async () => {
        firstEventTitle = await page.locator("article[data-testid='event-card'] h3").last().textContent();
        await eventsPage.bookNow(firstEventTitle);
        await page.waitForURL('**/events/*');
    })
    const eventsResourcePage = new EventResourcePage(page);
    let bookDetails;
    await test.step('Capture Booking Ref,tickets,price', async () => {
        bookDetails = await eventsResourcePage.bookEvent(firstEventTitle, 'Subburayan', 'mvsrayan1@gmail.com', '9080751313');
        console.log(bookDetails);
    })
    await test.step('Go to my Bookings.', async () => {
        await eventsResourcePage.goToMyBookings();
        await page.waitForURL('**/bookings');
    })
    await test.step('Select the booked event.' +
        + 'Capture and compare the details with previuosly captured details on the book page.', async () => {
            const myBookingsPage = new MyBookingsPage(page);
            await myBookingsPage.verifyBookingDetails(bookDetails);
        })
    await test.step('Click Admin->Manage Bookings in the dashboard.',async ()=>{
        await page.getByRole('button',{name:'Admin',exact:true}).click();
        await page.getByRole('link',{name:'Manage Bookings'}).click();
        await page.waitForURL('**/admin/bookings');
        await page.screenshot({path:testInfo.outputPath('Screenshot01.png')})
        await expect(page).toHaveScreenshot('Screenshot01.png');
    })
     
    await test.step('Select the booked event.'+
        +'Capture and compare the details with previuosly captured details on the book page.',async ()=>{
            const manageBookingRefLoc=page.getByRole('row').filter({hasText:bookDetails[0]});
            await expect(manageBookingRefLoc.locator('td:nth-child(4)')).toHaveText(bookDetails[1]);
            await expect(manageBookingRefLoc.locator('td:nth-child(5)')).toHaveText(bookDetails[2]);
            await page.screenshot({path:testInfo.outputPath('Screenshot02.png')});
            await expect(page).toHaveScreenshot('Screenshot02.png');
        })
})