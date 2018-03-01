Feature: Maintenance
  As a user of DHIS2
  I want to be able to preform actions on Maintenance section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open maintenance page

  Scenario: I want to see all items in the page
    Then List of checkboxes and label is displayed
    And The Select All checkbox is "not checked"
    And Perform button is disabled
    And No checkbox is checked
    And First line only contains Select All checkbox

  Scenario: I want to select all checkboxes at once
    And I click "Select all" checkbox
    Then All checkboxes are selected
    And Perform button is enabled
    And The Select All checkbox is checked
    And Perform button is enabled

  Scenario: I want to select few checkboxes one by one
    And I select four items checkbox
    Then Only selected checkboxes are selected
    And Perform button is enabled
    And The Select All checkbox is "not checked"
    And Perform button is enabled

  Scenario: I want to select no checkboxes
    And I select four items checkbox
    And I unselect the checkboxes
    Then No checkboxes are selected
    And The Select All checkbox is "not checked"
    And Perform button is disabled

  Scenario: I want to automatically unselect the Select All checkbox
    And I click "Select all" checkbox
    And I unselect last item checkbox
    Then The Select All checkbox is "not checked"
    And Perform button is enabled

  Scenario: I want to unselect all checkboxes
    And I click "Select all" checkbox
    And I click "Select all" checkbox
    Then No checkboxes are selected
    And The Select All checkbox is "not checked"
    And Perform button is disabled

  Scenario: I want to perform maintenance
    And I click "Select all" checkbox
    And I Click Perform button
    Then The Maintenance is executed
