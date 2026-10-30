import { expect } from "@playwright/test";
export class EventsPage {
    constructor(page) {
        this.page = page;
        this.eventsLoc = this.page.getByTestId('event-card');
    }
    async eventsURLvisibility() {
        await this.page.waitForURL('**/events');
        expect(await this.page.url()).toContain('/events');
    }
    async eventsShouldBeMoreThanOne() {
        await this.eventsLoc.first().waitFor();
        expect(await this.eventsLoc.count()).toBeGreaterThan(1);
    }
    async bookNow(eventTitle) {
        await this.eventsLoc.filter({ hasText: eventTitle }).getByRole('link', { name: 'Book Now' }).click();
    }
}
