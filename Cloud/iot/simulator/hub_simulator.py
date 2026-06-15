import json
import os
import time
import random
import ssl
import sys
import threading
from pathlib import Path
from datetime import datetime, timezone

try:
    import paho.mqtt.client as mqtt
except ModuleNotFoundError as exc:
    raise SystemExit(
        "Missing dependency: paho-mqtt. Install it with "
        "`python3 -m pip install -r requirements.txt`."
    ) from exc

PROJECT = os.getenv("BLUME_PROJECT", "blume")
ENVIRONMENT = os.getenv("BLUME_ENVIRONMENT", "dev")
ENDPOINT = os.getenv("BLUME_IOT_ENDPOINT", "a2pebmrq1cbdnn-ats.iot.eu-west-1.amazonaws.com")

REPO_ROOT = Path(__file__).resolve().parents[2]
CERT_DIR = REPO_ROOT / "iot" / "certs"
CERT_PATH = CERT_DIR / "certificate.pem.crt"
KEY_PATH = CERT_DIR / "private.pem.key"
CA_PATH = CERT_DIR / "AmazonRootCA1.pem"

FARM_ID = os.getenv("BLUME_FARM_ID", "farm-001")
CLIENT_ID = os.getenv("BLUME_CLIENT_ID", f"{PROJECT}-{ENVIRONMENT}-central-hub-001")

NODE_IDS = ["node-001", "node-002", "node-003"]
TANK_IDS = ["tank-001"]
CONNECTED = threading.Event()


def utc_timestamp():
    return datetime.now(timezone.utc).isoformat()


def generate_soil_payload(node_id):
    return {
          "farm_id": FARM_ID,
        "node_id": node_id,
        "timestamp": utc_timestamp(),
        "moisture": round(random.uniform(20.0, 80.0), 2),
        "temperature": round(random.uniform(18.0, 35.0), 2),
        "ph": round(random.uniform(5.5, 7.5), 2),
        "battery": round(random.uniform(70.0, 100.0), 1)
    }


def generate_water_payload(tank_id):
    return {
        "farm_id": FARM_ID,
        "tank_id": tank_id,
        "timestamp": utc_timestamp(),
        "level_pct": round(random.uniform(10.0, 100.0), 1),
        "pump_status": random.choice(["ON", "OFF"])
    }


def on_connect(client, userdata, flags, reason_code, properties=None):
    if reason_code == 0:
        CONNECTED.set()
        print("Connected to AWS IoT Core")
        topic = f"{PROJECT}/commands/{FARM_ID}/#"
        client.subscribe(topic)
        print(f"Subscribed to {topic}")
    else:
        print(f"Connection failed with code {reason_code}")


def on_message(client, userdata, msg):
    print("\nCOMMAND RECEIVED")
    print(f"Topic: {msg.topic}")
    print(f"Payload: {msg.payload.decode()}")


def on_disconnect(client, userdata, disconnect_flags, reason_code, properties=None):
    CONNECTED.clear()
    if reason_code == 0:
        print("Disconnected from AWS IoT Core.")
        return

    print(f"Disconnected from AWS IoT Core ({reason_code}). Attempting reconnect...")
    while True:
        try:
            client.reconnect()
            break
        except Exception as exc:
            print(f"Reconnect failed: {exc}. Retrying in 3s...")
            time.sleep(3)


def connect_client():
    missing_paths = [path for path in (CA_PATH, CERT_PATH, KEY_PATH) if not path.exists()]
    if missing_paths:
        paths = "\n".join(f"- {path}" for path in missing_paths)
        raise SystemExit(f"Missing AWS IoT certificate file(s):\n{paths}")

    client = mqtt.Client(
        callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
        client_id=CLIENT_ID,
    )

    client.tls_set(
        ca_certs=str(CA_PATH),
        certfile=str(CERT_PATH),
        keyfile=str(KEY_PATH),
        tls_version=ssl.PROTOCOL_TLSv1_2
    )

    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect

    print(f"Connecting to {ENDPOINT}...")
    client.connect(ENDPOINT, 8883, keepalive=60)

    return client


def run_simulator():
    client = connect_client()
    client.loop_start()

    if not CONNECTED.wait(timeout=10):
        client.loop_stop()
        client.disconnect()
        print(
            "Could not establish an AWS IoT connection. Check that the endpoint, "
            "certificate, private key, and IoT policy are correct."
        )
        return 1

    print("Sensor simulation started. Ctrl+C to stop.\n")

    try:
        while True:
            for node_id in NODE_IDS:
                CONNECTED.wait()
                topic = f"{PROJECT}/telemetry/soil/{FARM_ID}/{node_id}"
                payload = generate_soil_payload(node_id)

                client.publish(topic, json.dumps(payload), qos=1)
                print(f"[SOIL] {node_id} -> moisture={payload['moisture']} ph={payload['ph']}")
                time.sleep(1)

            for tank_id in TANK_IDS:
                CONNECTED.wait()
                topic = f"{PROJECT}/telemetry/water/{FARM_ID}/{tank_id}"
                payload = generate_water_payload(tank_id)

                client.publish(topic, json.dumps(payload), qos=1)
                print(f"[WATER] {tank_id} -> level={payload['level_pct']}%")
                time.sleep(1)

            print("Cycle complete -> sleeping 30s\n")
            time.sleep(30)

    except KeyboardInterrupt:
        print("Stopping simulator...")
        client.loop_stop()
        client.disconnect()
        return 0


if __name__ == "__main__":
    sys.exit(run_simulator())
