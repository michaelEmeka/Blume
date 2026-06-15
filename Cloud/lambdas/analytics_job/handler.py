import json
import boto3
import os
from datetime import datetime, timedelta, timezone
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")

SOIL_TABLE = os.environ["SOIL_TABLE"]
RESULTS_BUCKET = os.environ["RESULTS_BUCKET"]


def get_readings(farm_id, node_id, hours=24):
    table = dynamodb.Table(SOIL_TABLE)

    farm_node = f"{farm_id}#{node_id}"
    since = (datetime.now(timezone.utc) - timedelta(hours=hours)).strftime("%Y-%m-%dT%H:%M:%SZ")

    response = table.query(
        KeyConditionExpression=Key("farm_node_id").eq(farm_node) &
                              Key("timestamp").gte(since)
    )

    return response.get("Items", [])


def analyse(readings):
    if not readings:
        return None

    moistures = [float(r.get("moisture", 0)) for r in readings]
    phs = [float(r.get("ph", 0)) for r in readings]
    temps = [float(r.get("temperature", 0)) for r in readings]

    if not moistures or not phs or not temps:
        return None

    avg_moisture = sum(moistures) / len(moistures)
    avg_ph = sum(phs) / len(phs)
    avg_temp = sum(temps) / len(temps)

    if len(moistures) < 4:
        trend = "INSUFFICIENT_DATA"
    else:
        mid = len(moistures) // 2
        first_half = sum(moistures[:mid]) / max(mid, 1)
        second_half = sum(moistures[mid:]) / max(len(moistures) - mid, 1)

        if second_half > first_half + 5:
            trend = "RISING"
        elif second_half < first_half - 5:
            trend = "FALLING"
        else:
            trend = "STABLE"

    score = 100

    if avg_moisture < 30 or avg_moisture > 75:
        score -= 30
    if avg_ph < 5.5 or avg_ph > 7.5:
        score -= 25
    if avg_temp > 38:
        score -= 20
    if avg_temp < 10:
        score -= 15

    if 6.0 <= avg_ph <= 7.0:
        ph_status = "OPTIMAL"
    elif 5.5 <= avg_ph < 6.0 or 7.0 < avg_ph <= 7.5:
        ph_status = "ACCEPTABLE"
    else:
        ph_status = "CONCERNING"

    return {
        "avg_moisture": round(avg_moisture, 2),
        "avg_ph": round(avg_ph, 2),
        "avg_temperature": round(avg_temp, 2),
        "moisture_trend": trend,
        "ph_status": ph_status,
        "yield_probability": max(0, score),
        "reading_count": len(readings),
        "analysis_time": datetime.now(timezone.utc).isoformat()
    }


def lambda_handler(event, context):
    farms = event.get("farms", [
        {
            "farm_id": "farm-001",
            "node_ids": ["node-001", "node-002", "node-003"]
        }
    ])

    results = {}

    for farm in farms:
        farm_id = farm.get("farm_id", "unknown")
        results[farm_id] = {}

        for node_id in farm.get("node_ids", []):
            readings = get_readings(farm_id, node_id, hours=24)
            analysis = analyse(readings)

            if analysis:
                results[farm_id][node_id] = analysis
                print(json.dumps({
                    "farm": farm_id,
                    "node": node_id,
                    "analysis": analysis
                }))

    now = datetime.now(timezone.utc)
    key = f"analytics/{now.year}/{now.month:02d}/{now.day:02d}/report_{now.strftime('%Y-%m-%dT%H-%M-%S')}.json"

    s3.put_object(
        Bucket=RESULTS_BUCKET,
        Key=key,
        Body=json.dumps(results, default=str),
        ContentType="application/json"
    )

    return {
        "statusCode": 200,
        "results": results
    }