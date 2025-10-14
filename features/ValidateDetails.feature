Feature: Buggy Cars Rating

  Scenario: View and vote for Lamborghini Diablo
    Given I am logged in as "tester2025" with password "123456789aA!"
    When I navigate to a model of "Murciélago" from "Popular Make" as my choice
    And I vote and leave a comment "Great performance and design!"
    Then I validate the details in the page
      | Engine | Max Speed |
      | 6.5l   | 342km/h    |
    When I logout
    Then I should be returned to the homepage