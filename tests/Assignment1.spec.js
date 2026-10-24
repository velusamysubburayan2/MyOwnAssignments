import { expect, test } from '@playwright/test'
test('QAClickJet - Flight Booking', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('dropdownsPractise/');
    
    //select country
    const country='India';
    await page.getByPlaceholder('Type to Select').pressSequentially('ind');
    const countryIndia = page.locator('.ui-menu-item').filter({ hasText: country });
    await countryIndia.last().click();
    expect((await page.getByPlaceholder('Type to Select').inputValue()).trim()).toBe(country);

    //select From 
    const from='Madurai';
    await page.locator('#ctl00_mainContent_ddl_originStation1_CTXT').click();
    await page.locator('.dropdownDiv ul').last().waitFor();
    await page.getByRole('link', { name: `${from} (IXM)` }).click();
    expect((await page.locator("[id='ctl00_mainContent_ddl_originStation1_CTXT']").inputValue()).trim()).toContain(from);

    //select To
    const to='Chennai';
    await page.locator('#glsctl00_mainContent_ddl_destinationStation1_CTNR .dropdownDiv ul').first().waitFor();
    await page.locator('#glsctl00_mainContent_ddl_destinationStation1_CTNR .dropdownDiv ul').getByRole('link', { name: `${to} (MAA)` }).click();
    expect((await page.locator("#ctl00_mainContent_ddl_destinationStation1_CTXT").inputValue()).trim()).toContain(to);

    //Departure Date
    await page.locator('#ui-datepicker-div').waitFor();
    await page.locator('.ui-datepicker-group-last').getByRole('link',{name:'9'}).nth(0).click();
    const departureDate=await page.locator('.picker-first2 span').nth(1).textContent();
    expect(departureDate).toContain('09');

    //Return Date
    await page.locator('.picker-second button').click();
    await page.locator('.ui-datepicker-group-last').getByRole('link',{name:'10'}).nth(0).click();
    const returnDate=await page.locator('.picker-second span').nth(1).textContent();
    expect(returnDate).toContain('10');
    
    //Passengers
    await page.getByText('1 Adult').click();
    await page.locator('#divpaxOptions div').last().waitFor();
    await page.locator('#hrefIncAdt').click();
    await page.locator('#btnclosepaxoption').click();

    //Currency
    await page.locator("[name*='$DropDownListCurrency']").selectOption('AED');
    await page.locator("[id*='btn_FindFlights']").click();
    await page.pause();
});