import json
import boto3
import os
from decimal import Decimal
from datetime import datetime, timezone, timedelta

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")
sns = boto3.client("sns")

SOIL_TABLE = os.environ["SOIL_TABLE"]
WATER_TABLE = os.environ["WATER_TABLE"]
DATA_LAKE_BUCKET = os.environ["DATA_LAKE_BUCKET"]
ALERT_SNS_ARN = os.environ["ALERT_SNS_ARN"]

MOISTURE_LOW = 25.0
PH_LOW = 5.5
PH_HIGH = 7.5
TANK_LOW = 15.0


def ttl_timestamp(days=30):
    return int((datetime.now(timezone.utc) + timedelta(days=days)).timestamp())


def decimal_value(value, default=0):
    if value is None:
        value = default

    return Decimal(str(value))


def write_soil_reading(payload):
    table = dynamodb.Table(SOIL_TABLE)

    table.put_item(Item={
        "farm_node_id": f"{payload.get('farm_id', 'unknown')}#{payload.get('node_id', 'unknown')}",
        "timestamp": payload.get("timestamp", datetime.now(timezone.utc).isoformat()),
        "moisture": decimal_value(payload.get("moisture"), 0),
        "temperature": decimal_value(payload.get("temperature"), 0),
        "ph": decimal_value(payload.get("ph"), 0),
        "battery": decimal_value(payload.get("battery"), 100),
        "farm_id": payload.get("farm_id", "unknown"),
        "node_id": payload.get("node_id", "unknown"),
        "ttl_expiry": ttl_timestamp(30)
    })


def write_water_reading(payload):
    table = dynamodb.Table(WATER_TABLE)

    table.put_item(Item={
        "farm_tank_id": f"{payload.get('farm_id', 'unknown')}#{payload.get('tank_id', 'unknown')}",
        "timestamp": payload.get("timestamp", datetime.now(timezone.utc).isoformat()),
        "level_pct": decimal_value(payload.get("level_pct"), 0),
        "pump_status": payload.get("pump_status", "OFF"),
        "farm_id": payload.get("farm_id", "unknown"),
        "tank_id": payload.get("tank_id", "unknown"),
        "ttl_expiry": ttl_timestamp(30)
    })


def archive_to_s3(payload, topic):
    now = datetime.now(timezone.utc)

    safe_topic = topic.replace("/", "_")
    key = f"raw/{now.year}/{now.month:02d}/{now.day:02d}/{safe_topic}_{now.strftime('%Y-%m-%dT%H-%M-%S')}.json"

    s3.put_object(
        Bucket=DATA_LAKE_BUCKET,
        Key=key,
        Body=json.dumps(payload),
        ContentType="application/json"
    )


def check_and_alert(payload, topic):
    alerts = []

    if "soil" in topic:
        moisture = float(payload.get("moisture", 50))
        ph = float(payload.get("ph", 7.0))
        farm_id = payload.get("farm_id", "unknown")
        node_id = payload.get("node_id", "unknown")

        if moisture < MOISTURE_LOW:
            alerts.append(
                f"Low soil moisture detected at {farm_id} node {node_id}: {moisture}%"
            )

        if ph < PH_LOW or ph > PH_HIGH:
            alerts.append(
                f"Soil pH out of range at {farm_id} node {node_id}: {ph}"
            )

    if "water" in topic:
        level = float(payload.get("level_pct", 50))
        farm_id = payload.get("farm_id", "unknown")
        tank_id = payload.get("tank_id", "unknown")

        if level < TANK_LOW:
            alerts.append(
                f"Water tank low at {farm_id} tank {tank_id}: {level}%"
            )

    if alerts:
        sns.publish(
            TopicArn=ALERT_SNS_ARN,
            Message="\n".join(alerts),
            Subject="Blume Farm Alert"
        )


def lambda_handler(event, context):
    print(json.dumps(event))

    if not isinstance(event, dict):
        raise ValueError("Invalid payload format")

    topic = event.get("mqtt_topic", "")
    payload = event

    try:
        if "soil" in topic:
            write_soil_reading(payload)

        elif "water" in topic:
            write_water_reading(payload)

        archive_to_s3(payload, topic)
        check_and_alert(payload, topic)

        return {
            "statusCode": 200,
            "message": "Processed successfully"
        }

    except Exception as e:
        print(f"Processing error: {str(e)}")
        raise
