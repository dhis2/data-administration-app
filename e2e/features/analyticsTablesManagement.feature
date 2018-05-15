Feature: Analytics tables management
    As a user of DHIS2
    I want to be able to see the Analytics tables management section

    Background:
        Given that I am logged in to the Sierra Leone DHIS2
        When I open analytics tables management page

    Scenario: I want to see if the items are displayed
        Then A section with subtitle ANALYTICS TABLES UPDATE
        And Checkboxes to skip generation
        # this includes the [ ALL ]
        And Dropdown for number of last years to include is displayed with eleven elements
        And Start export action is enable

    Scenario: I want to generate the analytics tables
        And I change number of last years of data to include
        And I execute start export action
        Then Loading should be displayed
        And Start export action is disabled
        And Two columns result table is displayed
        And Checkboxes to skip generation are disabled
        And Dropdown for number of last years to include is disabled

    Scenario: I want to check skip checkboxes
        And I click checkboxes to skip generation
        Then The checkboxes to skip generation are checked
        And I am able to uncheck the checkboxes
