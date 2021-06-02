Feature: Users should be able to export analytics tables

  Scenario: User exports analytics tables
    Given the user navigated to the analytics tables page
    When the user clicks on the 'Start export' button
    Then the tables are exported
