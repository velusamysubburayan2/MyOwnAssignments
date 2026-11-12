import { expect } from "@playwright/test";
export class HomePage {
    constructor(page) {
        this.page = page;
        this.assertBrowserEvent = this.page.locator('h2');
        this.eventsPage = this.page.getByText('Browse Events →');
        this.eventCards = this.page.getByTestId('event-card');
        this.myBookingsLoc = this.page.getByTestId('nav-bookings');
        this.logoutLoc=this.page.getByRole('button',{name:'Logout'});
    }
    async gotoEventsPage() {
        await this.eventsPage.click();
    }
    async gotoBookingsPage() {
        await this.myBookingsLoc.click();
    }
    async browseEventsVisible() {
        await this.eventCards.first().waitFor();
        await expect(this.assertBrowserEvent.first()).toBeVisible();
    }
    async browseEventsNotVisible() {
        await expect(this.assertBrowserEvent.first()).not.toBeVisible();
    }
    async logout(){
        await this.logoutLoc.click();
    }
}
