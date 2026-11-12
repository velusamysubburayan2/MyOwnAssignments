/*
1.Login to the application using API token
2.Verify browse events is visible
3.logout the application.
4.Click backward arrow button.
5.verify browse events is not visible.
*/

import { test } from '@playwright/test';
import { request } from '@playwright/test';
import { APIUtils } from '../Utils/APIUtils';
import { HomePage } from '../PageObjects/HomePage';
import {EventsPage} from '../PageObjects/EventsPage';

test('Test the login and logout of an application', async function ({ browser }) {

    const apiContext = await request.newContext();
    const aPIUtils = new APIUtils(apiContext);
    const token = await aPIUtils.loginToApp();

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(value => { window.localStorage.setItem('eventhub_token', value) }, token)


    await page.goto('https://eventhub.rahulshettyacademy.com/');

    const homePage = new HomePage(page);
    await homePage.browseEventsVisible();
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/events') && response.status() === 200
        ),
        homePage.gotoEventsPage()
    ]);
    const eventsPage=new EventsPage(page);
    await eventsPage.eventsShouldBeMoreThanOne();
    await eventsPage.eventsURLvisibility();
    await homePage.logout();

    await page.waitForURL('**/login');
    await homePage.browseEventsNotVisible();

    await page.goBack();
    await homePage.browseEventsNotVisible();
})