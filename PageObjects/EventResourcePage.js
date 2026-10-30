import { expect } from "@playwright/test";
export class EventResourcePage {
    constructor(page) {
        this.page = page;
        this.eventTitleLoc = this.page.locator('.mb-6');
        this.fullNameLoc = this.page.getByPlaceholder('Your full name');
        this.mailLoc = this.page.getByTestId('customer-email');
        this.phoneNumberLoc = this.page.locator('#phone');
        this.addPlusLoc = this.page.getByRole('button', { name: '+' });
        this.confirmBookingLoc = this.page.getByRole('button', { name: 'Confirm Booking' });
        this.confirmBookingTextLoc = this.page.getByText('Booking Confirmed!');
        this.reserveTicketTextLoc = this.page.getByText('Your tickets are reserved.');
        this.bookingRefLoc = this.page.locator('.booking-ref');
        this.ticketLoc = this.page.locator('.p-4 .text-sm');
        this.priceLoc = this.page.locator('.p-4 .text-sm');
        this.viewMyBookingsLoc = this.page.getByRole('button', { name: 'View My Bookings' });

    }
    async bookEvent(eventTitle, name, mail, phoneNumber) {
        expect(await this.eventTitleLoc.first().locator('span').last().textContent()).toContain(eventTitle);
        await this.fullNameLoc.fill(name);
        await this.mailLoc.fill(mail);
        await this.phoneNumberLoc.fill(phoneNumber);
        await this.addPlusLoc.click();
        await this.confirmBookingLoc.click();
        await expect(this.confirmBookingTextLoc).toBeVisible();
        await expect(this.reserveTicketTextLoc).toBeVisible();
        const bookingRef = await this.bookingRefLoc.textContent();
        const ticket = await this.ticketLoc.nth(2).locator('span').last().textContent();
        const price = await this.priceLoc.nth(3).locator('span').last().textContent();
        const bookingDetails = [bookingRef, ticket, price];
        return bookingDetails;
    }
    async goToMyBookings() {
        await this.viewMyBookingsLoc.click();
    }
    async verifyEventTitle() {
        //Playwright internally checks the entire URL against the regex.
        //so you don't need to pass full URL as regex.
        expect(await this.page).toHaveURL(/\/events\/\d+$/);
    }

}
