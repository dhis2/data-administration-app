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
    And I click remove lock exception icon
	And I confirm lock exception removal
    Then The exception is removed

  Scenario: I do not want to remove lock exception
    And I click remove lock exception icon
	And I do not confirm lock exception removal
    Then The exception is not removed

  Scenario: I want to see the screen to add lock exception
    And I click in add lock exception button in list screen
    Then Add lock exception dialog is displayed
    And A select a data set dropdown is displayed
    And Organization tree is displayed
    And Level and group is displayed
    And Data set is displayed
    And Period selection is displayed

  Scenario: I want to add lock exceptions
    And I click in add lock exception button in list screen
    And I select organization set
    And I select level and group
    And I select a data set
    And I select period
    And Click add button in add new lock exception dialog
    Then The exception is added to the list of exceptions

  Scenario: I want to see batch deletion section
    And I click batch deletion button
    Then Title batch deletion is displayed
	And A list of lock exceptions batch is displayed
	And For each displayed lock exception batch there is a remove icon
	And I can return to previous page

  Scenario: I want to execute batch deletion
    And I click batch deletion button
    And I click remove lock exception batch icon
	And I confirm lock exception batch removal
    Then The exception batch is removed
