import { expect } from "@playwright/test";
export class HomePage{
    constructor(page){
        this.page=page;
        this.assertBrowserEvent=this.page.locator('h2');
        this.eventsPage=this.page.getByText('Browse Events →');

    }

    async gotoEventsPage(){
        await this.eventsPage.click();
    }
    async browseEventsVisible(){
        await expect(this.assertBrowserEvent.first()).toBeVisible();
    }
}
