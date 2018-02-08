Feature: Data Statistics
As a user of DHIS2
I want to be able to see the Data Statistics section

Background:
       Given That I am logged in to the Sierra Leone DHIS2
	   And I am not in "Data Statistics" section


#Scenario: I want to see all items in the page
#When I open the section "Data Statistics"
#Then I Should see several tables 
#And Each table contains an header
#And Each table contains rows with text on left and number on right

Scenario Outline: I want to see item in the page
When I open the section "Data Statistics"
Then I Should see table with title "<title>"
And "<count>" lines with text on left and number on right

Examples:
|title|count|
|Object type|19|
|Users logged in|5|
|User account invitations|2|
|Data values|4|
|Events|4|