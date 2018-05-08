Feature: Min Max value Generation
  As a user of DHIS2
  I want to be able to preform actions on Min Max value Generation section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open min max value generation page

  Scenario: I want to see all items in the page
    Then A column with a list of data sets is displayed
    And A column with organization unit tree is displayed
    And Generate action is displayed
    And Remove action is displayed

  Scenario: I want to generate min-max value
    And User selects a data set
    And User expands an organization unit selection
    Then User can only select one organization unit
    And User can click in generate

  Scenario: I want to remove min-max value
    When User selects a data set
    And User expands an organization unit selection
    Then User can only select one organization unit
    And User can click in remove
