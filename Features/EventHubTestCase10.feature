Feature: Login User Verification

Scenario Outline: Validate with two different Users
Given Login into the application with cred 'mvsrayan1@gmail.com' and 'Boopalan@231996'
Then verify Browser events  is visible
Then verify atleast one event is present in the homepage
Then verify and compare the login user mail id 'mvsrayan1@gmail.com' is present in the rightside top corner
When Logout the application

Examples:
    | userName | passWord | 
    | mvsrayan1@gmail.com  | Boopalan@231996  | 
    | Boopalan@gmail.com | Boopalan@231996 |

