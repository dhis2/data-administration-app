Feature: Analytics tables management
  As a user of DHIS2
  I want to be able to see the Analytics tables management section

  Background:
    Given that I am logged in to the Sierra Leone DHIS2
    When I open analytics tables management page

  Scenario: I want to see if the items are displayed
	Then a section with subtitle ANALYTICS TABLES UPDATE
	And checkboxes to skip generation
	And dropdown for number of last years to include is displayed with eleven elements #this includes the [ALL]
	And button to start export is displayed
	
  Scenario: I want to generate the Analytics tables
	And I change number of last years of data to include
	And I click button start export
	Then loading is displayed
	And button to start export is disabled
	And two columns result table is displayed
	And checkboxes to skip generation are disabled
	And dropdown for number of last years to include is disabled
	
	Scenario: I want to check Skip checkboxes
	And I click checkboxes to skip generation
	Then the checkboxes to skip generation are checked
	And I am able to uncheck the checkboxes
