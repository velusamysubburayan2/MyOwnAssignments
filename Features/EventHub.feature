Feature: EventHub-Bookings Validation

Scenario: Book Event and verify Booking confirmation in My Booings Page
Given Login with 'mvsrayan1@gmail.com' and 'Boopalan@231996'
When Goto Events page 
Then Verify atleast one event is present
When Select "PlaywrightTest" event and click Book Now
When Enter the Booking Details "PlaywrightTest", "Subburayan Velusamy", "mvsrayan1@gmail.com", "9080751313" and Click confirm
Then Verify Booking Details in My bookings page

Scenario: To verify atleast one event is present in the events page
Given Login with 'mvsrayan1@gmail.com' and 'Boopalan@231996'
When Goto Events page 
Then Verify atleast one event is present

