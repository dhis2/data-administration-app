Feature: Lock Exception
  As a user of DHIS2
  I want to be able to preform actions on Lock Exceptions section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open lock exceptions page

  Scenario: I want to see all exceptions in the page
    Then A list of exceptions is displayed
    And Pagination and number of rows are displayed
    And I can see a button to add lock a exception
	And For each lock exception there is a remove icon

  Scenario: I want to remove the lock exception
    And I click one of the remove lock exception icons
	And I confirm lock exception removal
    Then The exception is removed

  Scenario: I do not want to remove lock exception
    And I click one of the remove lock exception icons
	And I do not confirm lock exception removal
    Then The exception is not removed

  Scenario: I want to see the screen to add lock exception
    And I click in add lock exception button in list screen
    Then Add lock exception form is displayed
    And A select a data set for new lock exception is displayed
    And I select a data set for new lock exception
    Then Organization unit tree is displayed
    And Period select is displayed
    And Organization unit level select is displayed
    And Organization unit group select is displayed

  Scenario: I want to add lock exceptions
    And I click in add lock exception button in list screen
    Then Add lock exception form is displayed
    And A select a data set for new lock exception is displayed
    And I select a data set for new lock exception
    And Organization unit tree is displayed
    And I select an organization unit from the organization unit tree
    And I select period for new lock exception
    And Click add button in add new lock exception form
    Then The lock exception is added to the list of lock exceptions

  Scenario: I want to see batch deletion section
    And I click batch deletion button
    Then Title batch deletion is displayed
	And A list of lock exceptions batches is displayed
	And For each displayed lock exception batch there is a remove icon
	And I can return to previous page

  Scenario: I want to execute batch deletion
    And I click batch deletion button
    And I click remove lock exception batch icon
	And I confirm lock exception batch removal
    Then The exception batch is removed
