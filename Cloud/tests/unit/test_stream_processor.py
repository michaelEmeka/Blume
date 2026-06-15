import json
import boto3
import pytest
import os
from decimal import Decimal
from moto import mock_aws

os.environ["SOIL_TABLE"]       = "blume-soil-readings-test"
os.environ["WATER_TABLE"]      = "blume-water-readings-test"
os.environ["DATA_LAKE_BUCKET"] = "blume-data-lake-test"
os.environ["ALERT_SNS_ARN"]    = "arn:aws:sns:eu-west-1:123456789:blume-alerts-test"


def setup_infra():
    ddb = boto3.resource("dynamodb", region_name="eu-west-1")

    ddb.create_table(
        TableName="blume-soil-readings-test",
        KeySchema=[
            {"AttributeName": "farm_node_id", "KeyType": "HASH"},
            {"AttributeName": "timestamp", "KeyType": "RANGE"}
        ],
        AttributeDefinitions=[
            {"AttributeName": "farm_node_id", "AttributeType": "S"},
            {"AttributeName": "timestamp", "AttributeType": "S"}
        ],
        BillingMode="PAY_PER_REQUEST"
    )

    s3 = boto3.client("s3", region_name="eu-west-1")
    s3.create_bucket(Bucket="blume-data-lake-test")

    sns = boto3.client("sns", region_name="eu-west-1")
    sns.create_topic(Name="blume-alerts-test")


@mock_aws
def test_soil_reading_is_written():
    setup_infra()

    from lambdas.stream_processor.handler import lambda_handler

    event = {
        "farm_id": "farm-001",
        "node_id": "node-001",
        "timestamp": "2025-01-01T12:00:00",
        "moisture": 45.5,
        "temperature": 27.0,
        "ph": 6.5,
        "battery": 90.0,
        "mqtt_topic": "blume/telemetry/soil/farm-001/node-001"
    }

    result = lambda_handler(event, {})
    assert result["statusCode"] == 200

    table = boto3.resource("dynamodb", region_name="eu-west-1").Table(
        "blume-soil-readings-test"
    )
    item = table.get_item(
        Key={
            "farm_node_id": "farm-001#node-001",
            "timestamp": "2025-01-01T12:00:00",
        }
    )["Item"]
    assert item["moisture"] == Decimal("45.5")


@mock_aws
def test_low_moisture_triggers_alert():
    setup_infra()

    from lambdas.stream_processor.handler import lambda_handler

    event = {
        "farm_id": "farm-001",
        "node_id": "node-001",
        "timestamp": "2025-01-01T12:00:00",
        "moisture": 15.0,
        "temperature": 27.0,
        "ph": 6.5,
        "battery": 90.0,
        "mqtt_topic": "blume/telemetry/soil/farm-001/node-001"
    }

    result = lambda_handler(event, {})
    assert result["statusCode"] == 200
