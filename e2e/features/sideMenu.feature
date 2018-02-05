Feature: Side Menu
As a user of DHIS2
I want to be able to open the items from side Menu

Background:
       Given That I am logged in to the Sierra Leone DHIS2
	   
Scenario Outline: Access item from the menu
When I click "<item>" in the menu
Then The correspondent page with title "<page_title>" is displayed
And The menu "<item>" is highlighted 

Examples:
|item|text_link|
|Data Integrity|Check Data Integrity|
|Maintenance|Perform Maintenance|
|Min-Max Value Generation|Generate Min-Max Value Generation|


Scenario: Access Home from the menu
When I am not at Home
And I click "home" in the menu
Then The Home page is displayed
And The menu "home" is highlighted 