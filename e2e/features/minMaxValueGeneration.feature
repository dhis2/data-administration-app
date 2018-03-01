Feature: Min Max value Generation
  As a user of DHIS2
  I want to be able to preform actions on Min Max value Generation section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open min max value generation page

  Scenario: I want to see all items in the page
    Then A column with list of Data Set is displayed
    And A column with Organization Unit Selection checkboxes
    And Generate button
    And Remove button

  Scenario: I want to Generate Min-max Value
    And User selects Data Set
    And User expands Organization Unit Selection
    Then User can select several checkboxes
    And User can click in Generate

  Scenario: I want to Remove Min-max Value
    When User selects Data Set
    And User expands Organization Unit Selection
    Then User can select several checkboxes
    And User can click in Remove