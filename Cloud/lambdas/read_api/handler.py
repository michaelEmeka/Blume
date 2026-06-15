import json
import boto3
import os
from datetime import datetime, timedelta, timezone
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")

SOIL_TABLE = os.environ["SOIL_TABLE"]
WATER_TABLE = os.environ["WATER_TABLE"]


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


def cors_headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    }


def get_soil_readings(farm_id, node_id, hours):
    table = dynamodb.Table(SOIL_TABLE)

    farm_node = f"{farm_id}#{node_id}"
    since = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()

    response = table.query(
        KeyConditionExpression=Key("farm_node_id").eq(farm_node) &
                              Key("timestamp").gte(since),
        ScanIndexForward=False,
        Limit=100
    )

    return response.get("Items", [])


def get_water_readings(farm_id, tank_id, hours):
    table = dynamodb.Table(WATER_TABLE)

    farm_tank = f"{farm_id}#{tank_id}"
    since = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()

    response = table.query(
        KeyConditionExpression=Key("farm_tank_id").eq(farm_tank) &
                              Key("timestamp").gte(since),
        ScanIndexForward=False,
        Limit=50
    )

    return response.get("Items", [])


def safe_int(value, default):
    try:
        return int(value)
    except:
        return default


def lambda_handler(event, context):
    print(json.dumps(event))

    path_params = event.get("pathParameters") or {}
    query_params = event.get("queryStringParameters") or {}
    resource = event.get("resource", "")

    farm_id = path_params.get("farm_id")

    if not farm_id:
        return {
            "statusCode": 400,
            "headers": cors_headers(),
            "body": json.dumps({"error": "farm_id is required"})
        }

    try:
        hours = safe_int(query_params.get("hours"), 1)

        if "soil" in resource:
            node_id = query_params.get("node_id", "node-001")
            data = get_soil_readings(farm_id, node_id, hours)

            response = {
                "type": "soil_readings",
                "count": len(data),
                "data": data
            }

        elif "water" in resource:
            tank_id = query_params.get("tank_id", "tank-001")
            data = get_water_readings(farm_id, tank_id, hours)

            response = {
                "type": "water_readings",
                "count": len(data),
                "data": data
            }

        else:
            return {
                "statusCode": 404,
                "headers": cors_headers(),
                "body": json.dumps({"error": "Resource not found"})
            }

        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps(response, cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"Error: {str(e)}")

        return {
            "statusCode": 500,
            "headers": cors_headers(),
            "body": json.dumps({"error": "Internal server error"})
        }
