/* Test Case-1
    1.Login to the application with username and password
    2.Get all the events present in the page into an array.
    3.Goto Manage Events page and create a new Event
    4.Go back to the Home page verify that the newly created event is present or not.
    */
import { test, expect } from '@playwright/test';
import testData from '../Utils/testData.json' with {type:'json'};

const jsonData = JSON.parse(JSON.stringify(testData));
test('CreateEvent,BookTicket and Verify Bookings', async function ({ browser }) {

    console.log('1.Login to the application with username and password')
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://eventhub.rahulshettyacademy.com/login');
    const placeholderAttVal = await page.locator("[name='email']").getAttribute("placeholder");
    await page.getByPlaceholder(`${placeholderAttVal}`).pressSequentially(jsonData.userName);
    await page.locator("[id='password']").pressSequentially(jsonData.passWord);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('h2').first()).toBeVisible();

    console.log('2.Get all the events present in the page into an array.')
    const locEventTitles = page.locator('article h3');
    let count = await locEventTitles.count();
    const eventTitles = [];
    for (let i = 0; i < count; i++) {
        let textEventTitle = await locEventTitles.nth(i).textContent();
        eventTitles.push(textEventTitle);
    }
    expect(await eventTitles.includes(jsonData.eventTitle)).toBeFalsy();

    console.log('3.Goto Manage Events page and create a new Event')
    await page.goto('https://eventhub.rahulshettyacademy.com/admin/events');
    await page.getByTestId('event-title-input').fill(jsonData.eventTitle);
    await page.locator("select[id='category']").selectOption(jsonData.category);
    await page.locator('#city').fill(jsonData.city);
    await page.locator('#venue').fill(jsonData.venue);
    await page.locator('[id="event-date-&-time"]').fill(jsonData.eventDataTime);
    await page.locator("[id='price-($)']").fill(jsonData.price);
    await page.locator('#total-seats').fill(jsonData.totalSeats);
    await page.getByRole('button',{name:'+ Add Event'}).click();

    console.log('4.Go back to the Home page verify that the newly created event is present or not.')
    await page.getByRole('button',{name:'Home'}).first().click();
    await expect(page.getByText(jsonData.eventTitle)).toBeVisible();
});