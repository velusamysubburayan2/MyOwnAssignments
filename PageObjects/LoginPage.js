
export class LoginPage {

    constructor(page) {
        this.page = page;
        this.passWord=this.page.locator("[id='password']");
        this.signIn=this.page.getByRole('button', { name: 'Sign In' });
    }

    async loginTo(userName,passWord) {
        this.page.goto('https://eventhub.rahulshettyacademy.com/login');
        const placeholderAttVal = await this.page.locator("[name='email']").getAttribute("placeholder");
        await this.page.getByPlaceholder(`${placeholderAttVal}`).pressSequentially(userName);
        await this.passWord.pressSequentially(passWord);
        await this.signIn.click();
    }
}
