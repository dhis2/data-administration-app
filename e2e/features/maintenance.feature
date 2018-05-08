Feature: Maintenance
  As a user of DHIS2
  I want to be able to preform actions on Maintenance section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open maintenance page

  Scenario: I want to see all items in the page
    Then Possible maintenances are displayed
    And Perform maintenance action is disabled
    And No maintenances are selected

  Scenario: I want to be able to select maintenances
    Then I select some maintenances
    And Selected maintenances are selected
	And Not selected maintenances are not selected
    And Perform maintenance action is enabled

  Scenario: I want to be able to unselect maintenances
    And I select some maintenances
    And I unselect the maintenances
    Then No maintenances are selected
    And Perform maintenance action is disabled

  Scenario: I want to perform maintenance
    And I select some maintenances
    And I click perform maintenance action
    Then The maintenance is executed
