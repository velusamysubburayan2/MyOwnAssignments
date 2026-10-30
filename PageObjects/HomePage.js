import { expect } from "@playwright/test";
export class HomePage{
    constructor(page){
        this.page=page;
        this.assertBrowserEvent=this.page.locator('h2');
        this.eventsPage=this.page.getByText('Browse Events →');
        this.eventCards=this.page.getByTestId('event-card');

    }

    async gotoEventsPage(){
        await this.eventsPage.click();
    }
    async browseEventsVisible(){
        await this.eventCards.first().waitFor();
        await expect(this.assertBrowserEvent.first()).toBeVisible();
    }
}
