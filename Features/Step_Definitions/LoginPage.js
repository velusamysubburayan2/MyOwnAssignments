import { Given} from "@cucumber/cucumber";
Given('Login into the application with cred {string} and {string}', function (userName, passWord) {
  this.loginPage.loginTo(userName,passWord);
});
