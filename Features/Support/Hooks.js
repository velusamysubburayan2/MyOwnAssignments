import { Before, After } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { LoginPage } from "../../PageObjects/LoginPage.js";
import { HomePage } from "../../PageObjects/HomePage.js";

Before(async function () {
    //Create New Page
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    this.page=await context.newPage();
    //Login Page
    this.loginPage = new LoginPage(this.page);
    //Home Page
    this.homePage=new HomePage(this.page);
})