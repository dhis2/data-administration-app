Feature: Users should be able to run data maintenance functions

  Scenario: User runs data maintenance functions
    Given the user navigated to the maintenance page
    When the user selects the functions they would like to run
    And the user clicks on the 'Perform maintenance' button
    Then the selected functions are run
