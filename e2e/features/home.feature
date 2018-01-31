Feature: Home
As a user of DHIS2
I want to be able to See all the items and open the correspondent item

Background:
       Given that I am logged in to the Sierra Leone DHIS2
	   
Scenario Outline: Check the presence of the item
When I click in Home menu
Then I can see the "<item>" in the page
And I can see a description
And the "<text_link>" to the selected section

Examples:
|item|text_link|
|Data Integrity|Check Data Integrity|
|Maintenance|Perform Maintenance|
|Min-Max Value Generation|Generate Min-Max Value Generation|



Scenario Outline: Open the correspondent page
When I am on the Home section
And I click in the "<text_link>" link
Then the side menu "<item>" is selected
And the new section is opened
Examples:
|item|text_link|
|Data Integrity|Check Data Integrity|
|Maintenance|Perform Maintenance|
|Min-Max Value Generation|Generate Min-Max Value Generation|