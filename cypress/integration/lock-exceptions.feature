Feature: Users should be able to manage their lock exceptions

  Background:
    Given the user navigated to the lock exceptions page

  Scenario: User views lock exceptions
    Then lock exceptions should be fetched

  Scenario: User adds a lock exception
    When the user clicks on the 'Add lock exception' button
    Then a modal appears
    When the user selects a data set
    Then organisation units are fetched
    When the user selects an organisation unit
    And the user selects a period
    And the user clicks the modal's 'Add lock exception' button
    Then the lock exception should be added

  Scenario: User deletes a lock exception
    When the user clicks on the delete lock exception button for a lock exception
    Then a confirmation modal appears
    When the user clicks the modal's 'Yes, remove lock exception' button
    Then that lock exception is deleted

  Scenario: User batch deletes some lock exceptions
    When the user clicks the 'Batch deletion' button
    Then the user is taken to the batch deletion page
    When the user clicks on the batch delete button for a batch
    Then a confirmation modal appears
    When the user clicks the modal's 'Yes, remove lock exception' button
    Then the lock exceptions are batch deleted
