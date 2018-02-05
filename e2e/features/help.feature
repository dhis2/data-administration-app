Feature: Help
As a user of DHIS2
I want to be able to See the Help for section


Background:
       Given that I am logged in to the Sierra Leone DHIS2
	   
Scenario Outline: Open the correspondent help
	When I Open section "<section>"
	And I click help icon
	Then A popup is displayed with title "<section>"
	And I see a help description
	And A close button is displayed
	Examples:
	|section|
	|Data Integrity|
	|Maintenance|
	|Min-Max Value Generation|
	
Scenario Outline: Close the help
	When  I Open section "<section>"
	And Click Close button
	Then The pop up is dismissed
	Examples:
	|section|
	|Data Integrity|
	|Maintenance|
	|Min-Max Value Generation|