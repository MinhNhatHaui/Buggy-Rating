Feature: Buggy Cars Rating

  @vote @comment
  Scenario: View and vote for Lamborghini Diablo
    Given I am logged in as "tester2025" with password "123456789aA!"
    When I navigate to a model of "Murciélago" from "Popular Make" as my choice
    And I vote and leave a comment "Great performance and design!"
    # Then I should be able to see my comment in the list