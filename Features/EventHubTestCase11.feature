Feature: ManageBooings Page Functionality

Scenario: Book event and verify booking details in myBookings page and manageBookings page
Given Login into the application with cred 'mvsrayan1@gmail.com' and 'Boopalan@231996'

Then verify atleast one event is present in the homepage
When Capture and store all the eventTitles present in the page to an array
When Go to events Page

Then Capture and compare eventTitles with captured homepage eventTitles
When Click Book Now button to book an event

When Enter Mandatory Details and Book an event-Capture Booking Ref,tickets,price
When Go to my Bookings

Then Select booked event and Verify booking Details with captured details in the previous page
When Go to Admin->Manage Bookings.

Then Select booked event and Verify booking Details