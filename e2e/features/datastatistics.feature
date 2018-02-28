Feature: Data Statistics
  As a user of DHIS2
  I want to be able to see the Data Statistics section

  Background:
    Given That I am logged in to the Sierra Leone DHIS2
    And I am on home

  Scenario Outline: I want to see item in the page
    When I click in the "Data Statistics" in the page
    Then I Should see table with title "<title>"
    And "<count>" lines with text on left and number on right
    Examples:
      |title|count|
      |Object type|19|
      |Users logged in|5|
      |User account invitations|2|
      |Data values|4|
      |Events|4|

