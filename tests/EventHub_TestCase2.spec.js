/*
1.Login to the application with valid username and password
2.Verify Browse Events button present in the home page or not.
3.Click Browse Events button , get the url of the page and verify /events is present in it.
4.Pick one event and Click Book now button then verify the Event title in the page.
5.Enter all the details with 2 tickets and confirm booking then verify booking confirmed text is present or not,
Get booking ref,price,tickets.
6.CLick view my bookings,verify booking ref,price,tickets.
*/
import { test, expect } from '@playwright/test';
import testData from '../Utils/testData.json';

const jsonData = JSON.parse(JSON.stringify(testData));
test('Validate the Booking confirmation', async function ({ page }) {
    console.log('1.Login to the application with valid username and password.')
    page.goto('https://eventhub.rahulshettyacademy.com/login');
    const placeholderAttVal = await page.locator("[name='email']").getAttribute("placeholder");
    await page.getByPlaceholder(`${placeholderAttVal}`).pressSequentially(jsonData.userName);
    await page.locator("[id='password']").pressSequentially(jsonData.passWord);
    await page.getByRole('button', { name: 'Sign In' }).click();

    console.log('2.Verify Browse Events button present in the home page or not.')
    await expect(page.locator('h2').first()).toBeVisible();

    console.log('3.Click Browse Events button , get the url of the page and verify /events is present in it.'
        + 'And also verify atlease one event should be present')
    await page.getByText('Browse Events →').click();
    //Returns the matched response and no wait 
    const responseEvents = page.waitForResponse(response =>
        new URL(response.url()).pathname.endsWith('/events') && response.status() === 200
    );
    await responseEvents;//here wait
    expect(page.url()).toContain('/events');
    const locEvents = page.getByTestId('event-card');
    console.log(await locEvents.count())
    expect(await locEvents.count()).toBeGreaterThan(1);

    console.log('4.Pick one event and Click Book now button then verify the Event title in the page.')
    await locEvents.filter({ hasText: jsonData.eventTitle }).getByRole('link', { name: 'Book Now' }).click();
    const responseSpecificEvent = page.waitForResponse(response =>
        new URL(response.url()).pathname.match(/\/events\/([^/]+)$/) && response.status() === 200
    );
    await responseSpecificEvent;
    expect(await page.locator('.mb-6').first().locator('span').last().textContent()).toContain(jsonData.eventTitle);

    console.log('5.Enter all the details with 2 tickets and confirm booking then verify booking confirmed text is present or not,' +
        'Get booking ref,price,tickets.')
    await page.getByPlaceholder('Your full name').fill('Subburayan Velusamy');
    await page.getByTestId('customer-email').fill('mvsrayan1@gmail.com');
    await page.locator('#phone').fill('9080751313');
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    await expect(page.getByText('Booking Confirmed!')).toBeVisible();
    await expect(page.getByText('Your tickets are reserved.')).toBeVisible();
    const bookingRef = await page.locator('.booking-ref').textContent();
    const ticket = await page.locator('.p-4 .text-sm').nth(2).locator('span').last().textContent();
    const price = await page.locator('.p-4 .text-sm').nth(3).locator('span').last().textContent();
    console.log(bookingRef + " " + ticket + " " + price);

    console.log('6.CLick view my bookings,verify booking ref,price,tickets.')
    await page.getByRole('button',{name:'View My Bookings'}).click();
    const responseMyBookings=page.waitForResponse(response =>
        new URL(response.url()).pathname.endsWith('/bookings') && response.status()===200
    )
    await responseMyBookings;
    const locMyBooing=page.getByTestId('booking-card').filter({hasText:bookingRef});
    expect(await locMyBooing.locator('.gap-y-1 span').nth(1).textContent()).toContain(`${ticket} tickets`);
    expect(await locMyBooing.locator('.shrink-0 p').first().textContent()).toContain(price);
})