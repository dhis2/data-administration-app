Feature: Resource Tables
    As a user of DHIS2
    I want to be able to see the Resource Tables section

    Background:
        Given that I am logged in to the Sierra Leone DHIS2
        When I open resource tables page

    Scenario Outline: I want to see if the items are displayed
        Then The resource item with name "<name>" and "<tag>" tag is displayed
        And Generate tables action is enabled

        Examples:
            | name                                      | tag                                  |
            | Organisation unit structure               | (_orgunitstructure)                  |
            | Organisation unit category option combo   | (_orgunitstructure)                  |
            | Category option group set structure       | (_categoryoptiongroupsetstructure)   |
            | Data element group set structure          | (_dataelementgroupsetstructure)      |
            | Indicator group set structure             | (_indicatorgroupsetstructure)        |
            | Organisation unit group set structure     | (_organisationunitgroupsetstructure) |
            | Category structure                        | (_categorystructure)                 |
            | Data element category option combo name   | (_categoryoptioncomboname)           |
            | Data element structure                    | (_dataelementstructure)              |
            | Period structure                          | (_periodstructure)                   |
            | Date period structure                     | (_dateperiodstructure)               |
            | Data element category option combinations | (_dataelementcategoryoptioncombo)    |

    Scenario: I want to generate the resource tables
        And I click generate tables action
        Then Loading should be displayed
        And Generate tables action is disabled
