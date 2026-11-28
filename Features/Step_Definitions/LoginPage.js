import { Given } from "@cucumber/cucumber";
Given('Login into the application with cred {string} and {string}',{timeout:10000},async function (userName, passWord) {
  await this.loginPage.loginTo(userName, passWord);
});
