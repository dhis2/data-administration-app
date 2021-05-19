Feature: Users should be able to run integrity checks

  Scenario: User requests an integrity check
    Given the user navigated to the data integrity page
    When the user clicks on the 'Run integrity checks' button
    Then a data integrity check is requested
    And the user is shown the results of the check
