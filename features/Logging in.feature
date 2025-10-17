Feature: Login using registered user

  @login @smoke
  Scenario: As a registered user, I want to log in successfully so that I can access my account features
    Given I am logged in with default credentials
    Then I should see Profile menu on the header
    