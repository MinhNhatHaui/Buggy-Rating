Feature: Logout

    @logout @smoke
    Scenario: As a logged-in user, I want to log out successfully so that my account remains secure
        Given I am logged in with default credentials
        When I logout
        Then I should be returned to the homepage