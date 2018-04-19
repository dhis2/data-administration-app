Feature: Help
  As a user of DHIS2
  I want to be able to See the Help for section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: Open the correspondent documentation page
    When I click in the "<section>" in the page
    And I click help icon
    Then A documentation page in a new tab is opened
    Examples:
      | section                  |
      | Data Integrity           |
      | Maintenance              |
      | Resource Tables          |
      | Data Statistics          |
      | Lock Exception           |
      | Min-Max Value Generation |