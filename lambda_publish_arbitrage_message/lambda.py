import boto3
from dataclasses import dataclass
import json
import re


ARBITRAGE_OPPORTUNITIES_DATETIME_REGEX = r"arbitrage-opportunities/opportunities_(\d{8}_\d{2}:\d{2}:\d{2})"
ARBITRAGE_OPPORTUNITIES_DATETIME_TEMPLATE = "arbitrage-opportunities/opportunities_{datetime}"
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


def load_latest_arbitrage_opportunities(
        bucket: str,
        s3_prefix: str,
        client=None
    ):
    if client is None:
        client = boto3.client("s3")
    keys = []
    paginator = client.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket, Prefix=s3_prefix)
    for page in pages:
        if "Contents" in page:
            for obj in page["Contents"]:
                if obj["Key"] != f"{s3_prefix}/":
                    keys.append(obj["Key"])
    keys_datetimes = [
        datetime.strptime(
            re.findall(ARBITRAGE_OPPORTUNITIES_DATETIME_REGEX, key)[0],
            "%Y%m%d_%H:%M:%S")
        for key in keys
    ]
    if len(keys_datetimes) > 1:
        latest_opportunities_prefix = ARBITRAGE_OPPORTUNITIES_DATETIME_TEMPLATE.format(
            datetime=datetime.strftime(sorted(keys_datetimes, reverse=True)[1], "%Y%m%d_%H:%M:%S")
        )
        print(latest_opportunities_prefix)
        response = client.get_object(
            Bucket=bucket,
            Key=latest_opportunities_prefix
        )
        return json.loads(
            response["Body"].read().decode("utf-8")
        )
    return []


def lambda_handler(event, context):
    try:
        latest_opportunities = load_latest_arbitrage_opportunities(
            bucket=event.get("s3_bucket"),
            s3_prefix=event.get("s3_prefix")
        )
        arbitrage_opportunities = [
            opportunity 
            for opportunity in event.get("arbitrage_opportunities")
            if opportunity not in latest_opportunities
        ]
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
        return {
            "statusCode": 200,
            "body": {
                "message": "No new arbitrage opportunities to publish."
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "message": f"Failed to construct the arbitrage opportunities message: '{e}'."
            }
        }
