Feature: Login using registered user

  Scenario: As a registered user, I want to log in successfully so that I can access my account features
    Given I am logged in as "tester2025" with password "123456789aA!"
    Then I should see my username "tester2025" displayed on the homepage
    