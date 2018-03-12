Feature: Maintenance
  As a user of DHIS2
  I want to be able to preform actions on Maintenance section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open maintenance page

  Scenario: I want to see all items in the page
    Then List of checkboxes and label is displayed
    And Perform button is disabled
    And No checkbox is checked

  Scenario: I want to select few checkboxes one by one
    And I select four items checkbox
    Then Only selected checkboxes are selected
    And Perform button is enabled

  Scenario: I want to select no checkboxes
    And I select four items checkbox
    And I unselect the checkboxes
    Then No checkboxes are selected
    And Perform button is disabled

  Scenario: I want to perform maintenance
    And I select four items checkbox
    And I Click Perform button
    Then The Maintenance is executed
