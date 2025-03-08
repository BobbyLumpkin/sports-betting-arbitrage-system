import boto3
from datetime import (
    datetime,
    timedelta
)
import json
import logging
import requests
import sys


_logger = logging.getLogger(__name__)
_logger.setLevel(logging.INFO)
_formatter = logging.Formatter(
    "%(asctime)s:%(levelname)s:%(module)s: %(message)s"
)
_console_handler = logging.StreamHandler(sys.stdout)
_console_handler.setFormatter(_formatter)
_logger.addHandler(_console_handler)


s3 = boto3.client("s3")
secretsmanager = boto3.client("secretsmanager")


def lambda_handler(event, context):
    try:
        sports_list = event.get("sports_list")
        regions_list = event.get("regions_list")
        _logger.info(
            "Acquiring API key from secretsmanager."
        )
        API_KEY = json.loads(
            secretsmanager.get_secret_value(
                SecretId="odds_api_key"
            )["SecretString"]
        )["key"]

        response_list = []
        for sport in sports_list:
            _logger.info(
                f"Submitting API request for the sport: {sport}."
            )
            payload = {
                "apiKey": API_KEY,
                "oddsFormat": "decimal",
                "regions": regions_list
            }
            
            response = requests.get(
                url=f"https://api.the-odds-api.com/v4/sports/{sport}/odds",
                params=payload
            )
            response_list += json.loads(response.content)
        current_datetime = datetime.now() - timedelta(hours=5)
        current_datetime_str = current_datetime.strftime("%Y%m%d_%H_%M_%S")
        s3_key = event.get("s3_prefix") + f"/response_{current_datetime_str}.json"
        bucket = event.get("s3_bucket")

        _logger.info(
            "Writing API response to S3:\n"
            f"    - Bucket: '{bucket}'\n"
            f"    - Key: '{s3_key}'"
        )
        s3.put_object(
            Bucket=bucket,
            Key=s3_key,
            Body=json.dumps(response_list),
            ContentType="application/json"
        )
        return {
            "statusCode": 200,
            "body": {
                "message": "API Request was made and saved successfully."
            }
        }
    except Exception as e:
        _logger.error(str(e))
        return {
            "statusCode": 500,
            "body": {
                "message": f"API Request failed with the following error: .{str(e)}'."
            }
        }
