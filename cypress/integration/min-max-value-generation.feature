Feature: Users should be able to manage min-max values
  Background:
    Given the user navigated to the min-max values page

  Scenario: User generates min-max values for a dataset
    When the user selects a dataset
    And the user selects an organisation unit
    And the user clicks the 'Generate min-max values' button
    Then min-max values are generated for that organisation unit

  Scenario: User deletes min-max values for a dataset
    When the user selects a dataset
    And the user selects an organisation unit
    And the user clicks the 'Remove min-max values' button
    Then the min-max values of that organisation unit are deleted
