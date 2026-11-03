/*
1.Generate API token for Login application.
2.Insert that token to localstorage and login to application through UI.
3.verify in the catalog that first product is visible.
4.Navigate to the Bookings page.
5.Mock the original response.
6.verify the fake response is displayed.
*/
import { test, expect } from '@playwright/test';
import { APIUtils } from '../Utils/APIUtils';
import { request } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { HomePage } from '../PageObjects/HomePage';
import { MyBookingsPage } from '../PageObjects/MyBookingsPage';

test('EventHub_TestCase5-Response Interception', async ({ page }) => {
    const apiContext = await request.newContext();
    const aPIUtils = new APIUtils(apiContext);
    let token = await aPIUtils.loginToApp();

    await page.addInitScript(token => { window.localStorage.setItem('eventhub_token', token) }, token);
    await page.goto('https://eventhub.rahulshettyacademy.com/');

    const homePage = new HomePage(page);
    await homePage.browseEventsVisible();

    await page.route('https://api.eventhub.rahulshettyacademy.com/api/bookings?page=1&limit=10',
        async route => {
            await route.fulfill({
                headers: {
                    'authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                data: {
                    "success": true,
                    "data": [],
                    "pagination": {
                        "total": 0,
                        "page": 1,
                        "limit": 10,
                        "totalPages": 0
                    }
                }
            })
        })
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/api/bookings') && response.status() === 200),
        homePage.gotoBookingsPage()
    ]);
    const myBookingsPage = new MyBookingsPage(page);
    await myBookingsPage.noBookingsTextVisibility();
})
/*
1.Create an event through API and save response for User1.
2.Login to the application through UI for User2.
3.Navigate to the bookings page.
4.Select first booking present in the booking catalog.Click view Details.
5.Now Intercept the api request continue with User1 event booking id.
6.verify access denied text visible.
7.verify You are not authorized to view this booking text is visible.  
*/
test('EventHub_TestCase5-Request Interception', async function ({ page }) {
    const payloadCreateEvent = {
        customerEmail: "mvsrayan1@gmail.com",
        customerName: "Subburayan Velusamy",
        customerPhone: "9080751313",
        eventId: 285,
        quantity: 5
    }
    const apiContext = await request.newContext();
    const aPIUtils = new APIUtils(apiContext);
    const eventResponseUser1 = await aPIUtils.createEvent(payloadCreateEvent);
    console.log(eventResponseUser1);

    const loginPageUser2 = new LoginPage(page);
    await loginPageUser2.loginTo('Boopalan@gmail.com', 'Boopalan@231996');

    const homePageUser2 = new HomePage(page);
    await homePageUser2.browseEventsVisible();
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/bookings') && response.status() === 200
        ),
        homePageUser2.gotoBookingsPage()
    ]);

    const firstBookingRef = await page.getByTestId('booking-card').nth(0).locator('.mb-2 span').first().textContent();//
    const myBookingsPageUser2 = new MyBookingsPage(page);
    await page.route('https://api.eventhub.rahulshettyacademy.com/api/bookings/*',
        async route => {
            await route.continue({
                url:`https://api.eventhub.rahulshettyacademy.com/api/bookings/${eventResponseUser1.data.id}`
            })
        });
    await myBookingsPageUser2.gotoViewDetails(firstBookingRef);
    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText('You are not authorized to view this booking.')).toBeVisible();

})