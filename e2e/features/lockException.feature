Feature: Lock Exception
  As a user of DHIS2
  I want to be able to preform actions on Lock Exceptions section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open lock exceptions page

  Scenario: I want to see all Exceptions in the page
    Then A list of Lock Exceptions is displayed
    And Pagination is displayed
    And Number of rows are displayed
    And User can see a Button to add Exception

  Scenario: I want to see the options for Exception
    And I Select one item in the list
    Then I can see Remove button

  Scenario: I want to remove the details for Exception
    And I Select one item in the list
    And I click remove
    Then The exception is removed

  Scenario: I want to see the screen to add lock exceptions
    When I Click in Add button
    Then Add lock exception option is displayed
    And Organization list is displayed
    And Level and group is displayed
    And Data set is displayed
    And Period selection is displayed

  Scenario: I want to add lock exceptions
    When I Click in Add button
    And I Select Organization
    And I select level and Group
    And I select Data Set
    And I select period
    And Click Add
    Then The exception is added to the list of exceptions


