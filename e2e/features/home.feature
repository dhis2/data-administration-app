Feature: Home
  As a user of DHIS2
  I want to be able to See all the items and open the correspondent item

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: Check the presence of the item
    Then I can see the "<item>" in the page
    And I can see a description
    And the "<text_link>" to the selected section
    Examples:
      | item                     | text_link                 |
      | Data Integrity           | Check Data Integrity      |
      | Maintenance              | Perform Maintenance       |
      | Resource Tables          | Generate Resource Tables  |
      | Data Statistics          | Overview Data Statistics  |
      | Lock Exception           | Lock Exception Management |
      | Min-Max Value Generation | Generate Min-Max Value    |

  Scenario Outline: Open the correspondent page
    When I click in the "<item>" in the page
    Then the side menu "<item>" is selected
    And the new section is opened with "<header>"
    Examples:
      | item                     | header                    |
      | Data Integrity           | Data Integrity            |
      | Maintenance              | Maintenance               |
      | Resource Tables          | Resource Tables           |
      | Data Statistics          | Data Statistics           |
      | Lock Exception           | Lock Exception Management |
      | Min-Max Value Generation | Min-Max Value Generation  |