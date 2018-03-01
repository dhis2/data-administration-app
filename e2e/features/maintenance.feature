Feature: Maintenance
  As a user of DHIS2
  I want to be able to preform actions on Maintenance section

  Background:
    Given That I am logged in to the Sierra Leone DHIS2
    And I am not in "Maintenance" section


  Scenario: I want to see all items in the page
    When I open the section "Maintenance"
    Then List of checkboxes and label is displayed
    And The Select All checkbox is "not checked"
    And Perform button is disabled
    And No checkbox is checked
    And First line only contains Select All checkbox

  Scenario: I want to select all checkboxes at once
    When I open the section "Maintenance"
    And I click Select all checkbox
    Then All checkboxes are selected
    And Perform button contains the total number of items
    And The Select All checkbox is checked
    And Perform button is enabled

  Scenario: I want to select all checkboxes one by one
    When I open the section "Maintenance"
    And For each maintenance item I select the checkbox
    Then All item checkboxes are selected
    And Perform button contains the total number of items
    And The Select All checkbox is "checked"
    And Perform button is enabled

  Scenario: I want to select few checkboxes one by one
    When I open the section "Maintenance"
    And I select four items checkbox
    Then Only selected checkboxes are selected
    And Perform button contains the number of selected items
    And The Select All checkbox is "not checked"
    And Perform button is enabled


  Scenario: I want to select no checkboxes
    When I open the section "Maintenance"
    And I select four items checkbox
    And I unselect the checkboxes
    Then No checkboxes are selected
    And The Select All checkbox is "not checked"
    And Perform button is disabled

  Scenario: I want to automatically unselect the Select All checkbox
    When I open the section "Maintenance"
    And I click "Select all" checkbox
    And I unselect last item checkbox
    Then The Select All checkbox is "not checked"
    And Perform button is enabled
    And Perform button contains the number of selected items


  Scenario: I want to unselect all checkboxes
    When I open the section "Maintenance"
    And I click "Select all" checkbox
    And I click "Select all" checkbox
    Then No checkboxes are selected
    And The Select All checkbox is "not checked"
    And Perform button is disabled

  Scenario: I want to perform maintenance
    When I open the section "Maintenance"
    And I click "Select all" checkbox
    And I Click Perform button
    Then The Maintenance is executed
