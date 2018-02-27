Feature: Lock Exception
As a user of DHIS2
I want to be able to preform actions on Lock Exceptions section

Background:
       Given That I am logged in to the Sierra Leone DHIS2
	   And I am not in "Lock Exception" section
	   
Scenario: I want to see all Exceptions in the page
When I open the section "Lock Exception"
Then A list of Lock Exceptions is displayed
And Pagination is displayed
And Number of rows are displayed
And User can see a Button to add Exception


Scenario: I want to see the options for Exception
When I open the section "Lock Exception"
And I Select one item in the list
Then I can see details or Remove button

Scenario: I want to see the details for Exception
When I open the section "Lock Exception"
And I Select one item in the list
And I click details
Then I can see the details of the Exception

Scenario: I want to remove the details for Exception
When I open the section "Lock Exception"
And I Select one item in the list
And I click remove
Then The exception is removed

Scenario: I want to change number of rows displayed
When I open the section "Lock Exception"
And I change number of rows per page
Then The max number of items in the page is the selected in Rows per page

Scenario: I want to see the screen to add lock exceptions
When I Click in Add button
Then Add lock exception option is displayed
And Organization list is displayed
And Level and group is displayed
And Data set is displayed
And Year and Month selection is displayed

Scenario: I want to add lock exceptions
When I Click in Add button
And I Select Organization
And I select level and Group
And I select Data Set
And I select date
And Click Add
Then The exception is added to the list of exceptions


