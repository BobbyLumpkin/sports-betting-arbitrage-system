import boto3
from dataclasses import dataclass
from datetime import datetime
from itertools import combinations
import json
import logging
import sys


ARBITRAGE_OPPORTUNITIES_DATETIME_TEMPLATE = "{s3_opportunities_prefix}/opportunities_{datetime}"


_logger = logging.getLogger(__name__)
_logger.setLevel(logging.INFO)
_formatter = logging.Formatter(
    "%(asctime)s:%(levelname)s:%(module)s: %(message)s"
)
_console_handler = logging.StreamHandler(sys.stdout)
_console_handler.setFormatter(_formatter)
_logger.addHandler(_console_handler)


s3 = boto3.client("s3")


@dataclass(frozen=True)
class GameOutcomeLine():
    
    book: str
    last_update: str
    home_team: str
    away_team: str
    home_team_win_price: float
    away_team_win_price: float

    @classmethod
    def from_book_line_dict(
            cls,
            home_team: str,
            away_team: str,
            book_line_dict: dict
        ):
        """
        Load instance from a bookmaker dict in api response element.
        """
        book = book_line_dict["key"]
        home_team_outcome_dict = [
            outcome_dict 
            for outcome_dict in book_line_dict["markets"][0]["outcomes"]
            if home_team == outcome_dict["name"]
        ][0]
        away_team_outcome_dict = [
            outcome_dict 
            for outcome_dict in book_line_dict["markets"][0]["outcomes"]
            if away_team == outcome_dict["name"]
        ][0]
        return cls(
            book=book,
            last_update=book_line_dict["last_update"],
            home_team=home_team,
            away_team=away_team,
            home_team_win_price=home_team_outcome_dict["price"],
            away_team_win_price=away_team_outcome_dict["price"]
        )

    def to_dict(self):
        return {
            "book": self.book,
            "home_team": self.home_team,
            "away_team": self.away_team,
            "home_team_win_price": self.home_team_win_price,
            "away_team_win_price": self.away_team_win_price
        }


@dataclass(frozen=True)
class ArbitrageOpportunity():

    bet1: dict
    bet2: dict
    payout_multiplier: float

    def to_dict(self) -> dict:
        return {
            "bet1": self.bet1,
            "bet2": self.bet2,
            "payout_multiplier": self.payout_multiplier
        }


def is_arbitrage_opportunity(
        decimal_odds_list: list[float]
    ):
    implied_probabilities_list = [
        1 / odds
        for odds in decimal_odds_list
    ]
    total_implied_probabilities = sum(implied_probabilities_list)
    if total_implied_probabilities < 1:
        return True
    return False


def calculate_stake_proportions(
        decimal_odds_list: list[float]
    ) -> list[float]:
    implied_probabilities_list = [
        1 / odds
        for odds in decimal_odds_list
    ]
    total_implied_probabilities = sum(implied_probabilities_list)
    return [
        (1 / odds) / total_implied_probabilities
        for odds in decimal_odds_list
    ]


def search_for_arbitrage_opportunity_between_two_books(
        game_outcome_line1: GameOutcomeLine,
        game_outcome_line2: GameOutcomeLine
    ) -> ArbitrageOpportunity | None:
    """
    Searches for any arbitrage opportunity on a game between two books.
    """
    decimal_odds_list = [
        game_outcome_line1.home_team_win_price,
        game_outcome_line2.away_team_win_price
    ]
    is_arbitrage_opportunity_combination1 = is_arbitrage_opportunity(
        decimal_odds_list=decimal_odds_list
    )
    if is_arbitrage_opportunity_combination1:
        stake_proportions_list = calculate_stake_proportions(decimal_odds_list=decimal_odds_list)
        return ArbitrageOpportunity(
            bet1={
                "book": game_outcome_line1.book,
                "last_update": game_outcome_line1.last_update,
                "name": game_outcome_line1.home_team,
                "price": game_outcome_line1.home_team_win_price,
                "stake_proportion": stake_proportions_list[0]},
            bet2={
                "book": game_outcome_line2.book,
                "last_update": game_outcome_line2.last_update,
                "name": game_outcome_line2.away_team,
                "price": game_outcome_line2.away_team_win_price,
                "stake_proportion": stake_proportions_list[1]},
            payout_multiplier=stake_proportions_list[0] * game_outcome_line1.home_team_win_price
        )
    decimal_odds_list = [
        game_outcome_line1.away_team_win_price,
        game_outcome_line2.home_team_win_price
    ]
    is_arbitrage_opportunity_combination2 = is_arbitrage_opportunity(
        decimal_odds_list=decimal_odds_list
    )
    if is_arbitrage_opportunity_combination2:
        stake_proportions_list = calculate_stake_proportions(decimal_odds_list=decimal_odds_list)
        return ArbitrageOpportunity(
            bet1={
                "book": game_outcome_line1.book,
                "last_update": game_outcome_line1.last_update,
                "name": game_outcome_line1.away_team,
                "price": game_outcome_line1.away_team_win_price,
                "stake_proportion": stake_proportions_list[0]},
            bet2={
                "book": game_outcome_line2.book,
                "last_update": game_outcome_line2.last_update,
                "name": game_outcome_line2.home_team,
                "price": game_outcome_line2.home_team_win_price,
                "stake_proportion": stake_proportions_list[1]},
            payout_multiplier=stake_proportions_list[0] * game_outcome_line1.away_team_win_price
        )
    return


@dataclass(frozen=True)
class GameOutcomeLines():

    home_team: str
    away_team: str
    lines: list[GameOutcomeLine]

    @classmethod
    def from_api_response(
            cls,
            response: dict
        ):
        """
        Load instance from one element of api response list.
        """
        home_team = response["home_team"]
        away_team=response["away_team"]
        lines = [
            GameOutcomeLine.from_book_line_dict(
                home_team=home_team,
                away_team=away_team,
                book_line_dict=book_line_dict)
            for book_line_dict in response["bookmakers"]
        ]
        return cls(
            home_team=home_team,
            away_team=away_team,
            lines=lines
        )

    def search_for_arbitrage_opportunities(
            self
        ) -> list:
        arbitrage_opportunities = []
        combinations_list = combinations(self.lines, r=2)
        for combination in combinations_list:
            arbitrage_opportunity = search_for_arbitrage_opportunity_between_two_books(
                game_outcome_line1=combination[0],
                game_outcome_line2=combination[1]
            )
            if arbitrage_opportunity is not None:
                arbitrage_opportunities.append(arbitrage_opportunity)
        return arbitrage_opportunities


def lambda_handler(event, context):
    try:
        api_responses = event.get("api_responses")
        arbitrage_opportunities_list = []
        for response in api_responses:
            game_outcome_lines = GameOutcomeLines.from_api_response(response)
            arbitrage_opportunities = game_outcome_lines.search_for_arbitrage_opportunities()
            if arbitrage_opportunities:
                arbitrage_opportunities_list += [
                    arbitrage_opportunity.to_dict()
                    for arbitrage_opportunity in arbitrage_opportunities
                ]
        if arbitrage_opportunities_list:
            current_datetime = datetime.now().strftime("%Y%m%d_%H:%M:%S")
            key = ARBITRAGE_OPPORTUNITIES_DATETIME_TEMPLATE.format(
                s3_opportunities_prefix=event.get("s3_opportunities_prefix"),
                datetime=current_datetime
            )
            _logger.info(
                "Writing found arbitrage opportunities to S3:\n"
                f"    - Bucket: \"{event.get('s3_bucket')}\"\n"
                f"    - Key: \"{key}\""
            )
            s3.put_object(
                Bucket=event.get("s3_bucket"),
                Key=key,
                Body=json.dumps(arbitrage_opportunities_list),
                ContentType="application/json"
            )
        return {
            'statusCode': 200,
            'body': {
                "arbitrage_opportunities": arbitrage_opportunities_list
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': {
                "message": (
                    "Failed to find arbitrage opportunities, "
                    f"with the following error: '{str(e)}'."
                )
            }
        }
