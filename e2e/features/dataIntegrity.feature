Feature: Data Integrity
  As a user of DHIS2
  I want to be able to see the Data Integrity section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open data integrity page

  Scenario: I want to see if the loading is displayed
    Then Loading should be displayed

  Scenario: I Want to see if items are displayed
    Then The error items text are red and contain expand button
    And The valid items text are green and contains a green check icon
    And The errors are displayed first

  Scenario: I want to expand error items
    And I click to expand in "error" item
    Then I can see the error description
    And The icon changes to collapse

  Scenario: I want to collapse error items
    And I click to expand in "error" item
    And I click collapse item
    Then The item is collapsed
    And The description is not displayed
    And The icon changes to expand

  Scenario: I do not want the correct items to be expanded
    And I click to expand in "OK" item
    Then Nothing happens