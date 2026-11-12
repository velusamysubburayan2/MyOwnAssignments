import { test, expect } from '@playwright/test';
import { request } from '@playwright/test';
import { APIUtils } from '../Utils/APIUtils';
import { HomePage } from '../PageObjects/HomePage';
import { MyBookingsPage } from '../PageObjects/MyBookingsPage';
import { MyBookingsDetailsPage } from '../PageObjects/MyBookingsDetailsPage';

test('Mock Response for specific Booking and for that Booking view Details', async ({ page }) => {

    const patchedValues = {
        bookingRef: 'QA-PATCH-2026-001',
        eventTitle: 'Mocked Booking Reconciliation Event',
        quantity: 3,
        totalPrice: 4321,
    };
    let patchedBooking;
    let unpatchedBooking
    await page.route('**/api/bookings**',
        async (route) => {
            const request = route.request();
            const requestUrl = new URL(request.url());
            const isBookingList = requestUrl.pathname.endsWith('api/bookings');
            if (isBookingList) {
                let originalResponse = await route.fetch();
                let originalResponseJson = await originalResponse.json();
                let originalBooking = await originalResponseJson.data[0];
                unpatchedBooking = await originalResponseJson.data.find(booking => booking.id !== originalBooking.id);
                patchedBooking = {
                    ...originalBooking,
                    "quantity": patchedValues.quantity,
                    "totalPrice": patchedValues.totalPrice,
                    "bookingRef": patchedValues.bookingRef,
                    event: {
                        ...originalBooking.event,
                        "title": patchedValues.eventTitle,
                    }
                }
                let patchedBookings = [...originalResponseJson.data];
                patchedBookings[0] = patchedBooking;
                await route.fulfill({
                    ...originalResponse,
                    body: JSON.stringify({
                        ...originalResponseJson,
                        data: patchedBookings
                    }),
                })

                return;
            }
            const bookingID = requestUrl.pathname.match(/\/api\/bookings\/([^/]+)$/)?.[1];
            console.log('bookingID=' + bookingID + 'patchedBooking=' + patchedBooking.id + 'reques=' + request.method())
            if (request.method() === 'GET' && bookingID === String(patchedBooking.id)) {
                const originalResponse = await route.fetch();
                const originalResponseJson = await originalResponse.json();
                const originalResponseJsonData = await originalResponseJson.data;
                
                await route.fulfill({
                    originalResponse,
                    body: JSON.stringify({
                        ...originalResponseJson,
                        data: {
                            ...originalResponseJsonData,
                            "quantity": patchedValues.quantity,
                            "totalPrice": patchedValues.totalPrice,
                            "bookingRef": patchedValues.bookingRef,
                            event: {
                                ...originalResponseJsonData.event,
                                "title": patchedValues.eventTitle,
                            }
                        }
                    })
                })
                return;
            }
            await route.continue();
        });
    const apiContext = await request.newContext();
    const aPIUtils = new APIUtils(apiContext);
    const token = await aPIUtils.loginToApp();
    await page.addInitScript(token => { window.localStorage.setItem('eventhub_token', token) }, token);
    await page.goto('https://eventhub.rahulshettyacademy.com/');

    const homePage = new HomePage(page);
    await homePage.browseEventsVisible();
    await homePage.gotoBookingsPage();

    const bookingDetails = [patchedValues.bookingRef,String(patchedValues.quantity),String(patchedValues.totalPrice)];
    const myBookingsPage = new MyBookingsPage(page);
    await myBookingsPage.gotoViewDetails(bookingDetails);

    const myBookingsDetailsPage = new MyBookingsDetailsPage(page);
    await myBookingsDetailsPage.verifyBookingDetails(patchedValues.eventTitle, bookingDetails);

});