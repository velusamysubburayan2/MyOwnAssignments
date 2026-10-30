import { expect } from "@playwright/test";

export class MyBookingsPage {
    constructor(page) {
        this.page = page;
        this.bookingCard=this.page.getByTestId('booking-card');
    }
    async verifyBookingDetails(bookingDetails) {
        const locMyBooing = this.bookingCard.filter({ hasText: bookingDetails[0] });
        expect(await locMyBooing.locator('.gap-y-1 span').nth(1).textContent()).toContain(`${bookingDetails[1]} tickets`);
        expect(await locMyBooing.locator('.shrink-0 p').first().textContent()).toContain(bookingDetails[2]);
    }
}
