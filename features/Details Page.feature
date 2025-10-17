Feature: Validate the details in the page

  @details
  Scenario: As a user, I want to validate the details of a specific car model so that I can ensure the information is accurate
    Given I am on the homepage
    When I navigate to a model of "Diablo" from "Popular Make" as my choice
    Then I validate the details in the page
      | Engine | Max Speed |
      | 6.0.l   | 25km/h   |
    # TODO: Saving details to one json file and reading from it to verify model's description
