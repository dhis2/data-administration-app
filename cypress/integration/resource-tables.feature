Feature: Users should be able to generate resource tables

  Scenario: User generates resource tables
    Given the user navigated to the resource tables page
    When the user clicks on the 'Generate tables' button
    Then the resource tables are generated
