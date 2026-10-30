import { expect } from "@playwright/test";

export class MyBookingsDetailsPage {
    constructor(page) {
        this.page = page;
        this.eventsLoc = this.page.locator('.space-y-3');
        this.priceLoc = this.page.locator('.pt-2 span');
    }
    async verifyBookingDetails(eventTitle,bookingDetails) {
        const eventTitleview = await this.eventsLoc.nth(0).locator('.text-right').nth(0).textContent();
        const ticket = await this.eventsLoc.nth(2).locator('.text-right').nth(0).textContent();
        const price = await this.priceLoc.nth(1).textContent();
        expect(eventTitleview).toContain(eventTitle);
        expect(ticket).toContain(bookingDetails[1]);
        expect(price.replace("$", "")).toContain(bookingDetails[2].replace("$",""));
    }
}