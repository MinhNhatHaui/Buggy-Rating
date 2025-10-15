Feature: Navigate to a model of your choice

    Scenario: As a user, I want to navigate to a specific car model from the homepage so that I can view its details
        Given I am on the homepage
        When I navigate to a model of "Diablo" from "Popular Make" as my choice
        Then I should be able to see the "Diablo" model details page