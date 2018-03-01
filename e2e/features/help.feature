Feature: Help
  As a user of DHIS2
  I want to be able to See the Help for section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: Open the correspondent help
    When I click in the "<section>" in the page
    And I click help icon
    Then A popup is displayed with title "<title>"
    And I see a help description
    And A close button is displayed
    Examples:
      | section                  | title                     |
      | Data Integrity           | Data Integrity            |
      | Maintenance              | Maintenance               |
      | Data Statistics          | Data Statistics           |
      | Lock Exception           | Lock Exception Management |
      | Min-Max Value Generation | Min-Max Value Generation  |

  Scenario Outline: Close the help
    When I click in the "<section>" in the page
    And I click help icon
    And Click Close button
    Then The pop up is dismissed
    Examples:
      | section                  |
      | Data Integrity           |
      | Maintenance              |
      | Data Statistics          |
      | Lock Exception           |
      | Min-Max Value Generation |