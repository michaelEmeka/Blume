import json
import boto3
import os
import uuid
from datetime import datetime, timezone

IOT_ENDPOINT = os.environ["IOT_ENDPOINT"]

iot_data = boto3.client(
    "iot-data",
    endpoint_url=f"https://{IOT_ENDPOINT}",
    region_name=os.environ.get("AWS_REGION", "eu-west-1")
)
dynamodb = boto3.resource("dynamodb")

COMMAND_LOG_TABLE = os.environ["COMMAND_LOG_TABLE"]

VALID_COMMANDS = [
    "VALVE_OPEN",
    "VALVE_CLOSE",
    "PUMP_START",
    "PUMP_STOP",
    "REFILL_TANK"
]


def cors_headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    }


def log_command(command_id, farm_id, action, target, issued_by, status):
    try:
        table = dynamodb.Table(COMMAND_LOG_TABLE)

        table.put_item(Item={
            "command_id": command_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "farm_id": farm_id,
            "action": action,
            "target": target,
            "issued_by": issued_by,
            "status": status
        })
    except Exception as e:
        print(f"Command logging failed: {str(e)}")


def lambda_handler(event, context):
    print(json.dumps(event))

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {
            "statusCode": 400,
            "headers": cors_headers(),
            "body": json.dumps({"error": "Invalid JSON body"})
        }

    action = body.get("action")
    farm_id = body.get("farm_id")
    target = body.get("target")

    issued_by = (
        event.get("requestContext", {})
             .get("authorizer", {})
             .get("claims", {})
             .get("email")
        or event.get("requestContext", {})
                .get("authorizer", {})
                .get("claims", {})
                .get("username")
        or "unknown"
    )

    if not action or not farm_id or not target:
        return {
            "statusCode": 400,
            "headers": cors_headers(),
            "body": json.dumps({"error": "action, farm_id and target are required"})
        }

    if action not in VALID_COMMANDS:
        return {
            "statusCode": 400,
            "headers": cors_headers(),
            "body": json.dumps({
                "error": "Invalid command",
                "valid_commands": VALID_COMMANDS
            })
        }

    command_id = str(uuid.uuid4())

    topic = f"blume/commands/{farm_id}/{target}"

    payload = {
        "command_id": command_id,
        "action": action,
        "farm_id": farm_id,
        "target": target,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "issued_by": issued_by
    }

    try:
        iot_data.publish(
            topic=topic,
            qos=1,
            payload=json.dumps(payload)
        )

        log_command(command_id, farm_id, action, target, issued_by, "SENT")

        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps({
                "command_id": command_id,
                "status": "sent",
                "topic": topic
            })
        }

    except Exception as e:
        log_command(command_id, farm_id, action, target, issued_by, "FAILED")

        print(f"Error sending command: {str(e)}")

        return {
            "statusCode": 500,
            "headers": cors_headers(),
            "body": json.dumps({"error": "Failed to send command"})
        }
