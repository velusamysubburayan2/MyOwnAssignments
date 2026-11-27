import { expect } from "@playwright/test";

export class MyBookingsPage {
    constructor(page) {
        this.page = page;
        this.bookingCard = this.page.getByTestId('booking-card');
        this.noBookingsLoc=this.page.getByText('No bookings yet');
    }
    async verifyBookingDetails(bookingDetails) {
        const locMyBooing = this.bookingCard.filter({ hasText: bookingDetails[0] });
        const price = await locMyBooing.locator('.shrink-0 p').first().textContent();
        const tickets=await locMyBooing.locator('.gap-y-1 span').nth(1).textContent();
        if(tickets?.includes(`${bookingDetails[1]} tickets`)){
            expect(tickets).toContain(`${bookingDetails[1]} tickets`);
        }
        else{
            expect(tickets).toContain(`${bookingDetails[1]} ticket`);
        }
       
        expect(price.replace(/[$,]/g, '')).toContain(bookingDetails[2].replace(/[$,]/g, ''));
    }
    async gotoViewDetails(bookingDetails) {
        const locMyBooing = this.bookingCard.filter({ hasText: bookingDetails[0] });
        await locMyBooing.getByRole('button', { name: 'View Details' }).click();
    }
    async noBookingsTextVisibility(){
        await expect(this.noBookingsLoc).toBeVisible();
    }
}
