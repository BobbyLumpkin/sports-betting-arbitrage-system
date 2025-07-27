import boto3
from dataclasses import dataclass


ARBITRAGE_OPPORTUNITY_STR_TEMPLATE = """
**Opportunity: {opportunity_name}**

{bet_strs}

Payout Multiplier: {payout_multiplier}
"""
ARBITRAGE_OPPORTUNITY_SEPARATOR = """
----------------------------------------
"""
BET_STR_TEMPLATE = """
**Bet {bet_number}**
  * Book: {book}
  * Name: {name}
  * Price: {price}
  * Stake Proportion: {stake_proportion}
  * As Of: {last_update}
"""
MESSAGE_TEMPLATE = """
Hello Fellow Vig Vanquishing Compatriots,

Ready thine armour; a vanquishing opportunity hath
arisen! Find below the details of thy quest revealed:

{arbitrage_opportunities_str}

Quickly lads, lest thou want thy metaphorical blades to remain dry!

Yours Truly,
VigVanquisher
"""
TOPIC_ARN = "arn:aws:sns:us-east-2:945893360759:VigVanquisher"


@dataclass
class BetNamesAndStrs():

    bet_names: set
    bet_strs_list: list


def lambda_handler(event, context):
    try:
        body = event.get("body")
        arbitrage_opportunities = body.get("arbitrage_opportunities")
        if arbitrage_opportunities:
            arbitrage_opportunity_str_list = []
            for opportunity in arbitrage_opportunities:
                bet_names_and_strs = BetNamesAndStrs(bet_names=set(), bet_strs_list=[])
                bets = [
                    value
                    for value in opportunity.values()
                    if isinstance(value, dict)
                ]
                for i, bet in enumerate(bets):
                    bet_names_and_strs.bet_strs_list.append(
                        BET_STR_TEMPLATE.format(
                            bet_number=i+1,
                            book=bet.get("book"),
                            name=bet.get("name"),
                            price=bet.get("price"),
                            stake_proportion=bet.get("stake_proportion"),
                            last_update=bet.get("last_update")
                        )
                    )
                    bet_names_and_strs.bet_names.add(bet.get("name"))
                bet_strs = "\n".join(bet_names_and_strs.bet_strs_list)
                opportunity_name_str = " & ".join(bet_names_and_strs.bet_names)
                arbitrage_opportunity_str_list.append(
                    ARBITRAGE_OPPORTUNITY_STR_TEMPLATE.format(
                        opportunity_name=opportunity_name_str,
                        bet_strs=bet_strs,
                        payout_multiplier=str(opportunity.get("payout_multiplier"))
                    )
                )
            message = MESSAGE_TEMPLATE.format(
                arbitrage_opportunities_str=ARBITRAGE_OPPORTUNITY_SEPARATOR.join(arbitrage_opportunity_str_list)
            )
            sns_client = boto3.client("sns")
            response = sns_client.publish(
                TopicArn=TOPIC_ARN,
                Message=message,
                Subject="Found Arbitrage Opportunities!"
            )
            return {
                "statusCode": 200,
                "body": {
                    "message": "Successfully published arbitrage opportunities message to sns."
                }
            }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "message": f"Failed to construct the arbitrage opportunities message: '{e}'."
            }
        }
