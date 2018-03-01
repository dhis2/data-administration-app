Feature: Side Menu
  As a user of DHIS2
  I want to be able to open the items from side Menu

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: Open the correspondent page
    When I click in the "<item>" in the sidemenu
    Then the side menu "<item>" is selected
    And the new section is opened with "<header>"
    Examples:
      | item                     | header                    |
      | Data Integrity           | Data Integrity            |
      | Maintenance              | Maintenance               |
      | Data Statistics          | Data Statistics           |
      | Lock Exception           | Lock Exception Management |
      | Min-Max Value Generation | Min-Max Value Generation  |
