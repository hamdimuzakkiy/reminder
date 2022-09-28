# Apps Script - Spreadsheet Reminder

### Motivation
I have a difficulties on tracking task related or somwthing to do, sometimes i put reminder on google calendar. There is another issue if the task need additional time or someone we working with have another urgency. Sometimes i forget to update the deadline on the calendar!!!

### Why Build This?
I need to keep up with my work related with the schedule, since i have a lot things to do and follow up. Also i have a recap on the spreadsheet!

## Description
This automation help us to create a reminder on the google calendar, we just put event on the spreadsheet and it will generate the event on google calendar every certain time. This automation have several capability:

1. Create event on the google calendar for incoming task
2. Remove event once there is deadline changed / the task done
3. Create past event that aren't done yet for tomorrow
4. Invite guests by email
5. The event will be added on 8am (can be changed on the code)

## How to Install and Run
1. Create New Spreadsheet 
2. Change tab name to "reminder"
3. Click Extensions > Apps Script
4. Copy reminder.gs code
5. Paste it on the "Code.gs"
6. Give try some case and run it, google will ask some permission due to spreadsheet & calendar
7. Click Trigger (timer icon)
8. Add Trigger 
9. Choose which function to run (main) -> Choose which deployment should run (Head) -> Select event source (Time-driven) -> Select type of time based trigger (Day timer) -> Select time of day (Midnight to 1am)

## How to Use the Project
Every time you want to be remind, add new row on the "reminder" tab. It will create a new google calendar event at midnight!!!

<img width="1002" alt="image" src="https://user-images.githubusercontent.com/10499139/192428178-5569131e-f400-48d2-8250-d8dd0135cba8.png">
