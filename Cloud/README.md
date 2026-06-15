##Backend Docs

# blume-cloud

# Blume — IoT-Powered Precision Agriculture System

> Smart soil monitoring and intelligent irrigation control for African farmers.

---

## The Problem

Farmers in Nigeria irrigate on fixed schedules with no knowledge of actual soil conditions. Water tanks run dry without warning. Soil degradation goes undetected until yield has already dropped. Most precision agriculture solutions on the market are built for large commercial farms in developed markets — not for the smallholder farmer trying to make the most of what they have.

## What Blume Does

Blume connects physical sensors on the farm to a cloud backend that monitors soil and water conditions continuously, automates irrigation decisions, and gives farmers remote control of their farm from a mobile dashboard.

The system runs across three subsystems built and integrated by the team:

- **Smart Water Management** — monitors tank levels, triggers automatic refills, and accepts remote pump commands
- **Smart Irrigation** — opens and closes valves based on live soil moisture readings and weather forecast data
- **Soil Telemetry** — collects moisture, temperature, and pH data and sends it to the cloud for analysis and reporting

---

## Cloud Architecture

This repository contains the cloud backend — everything that happens after sensor data leaves the farm hub.

Sensor Nodes → Central Hub → AWS IoT Core → Rule Engine → Lambda

│

┌────────────────────┼──────────────────┐

▼                    ▼                  ▼

DynamoDB             S3             SNS Alerts

│                    │

▼                    ▼

Read API λ         Analytics Job λ

│                    │

▼                    ▼

API Gateway         S3 Results

│

▼

Farmer App


### Services Used

| Service | Role |
|---|---|
| AWS IoT Core | MQTT broker — receives all telemetry from the hub |
| IoT Rule Engine | Routes messages by topic pattern to Lambda |
| AWS Lambda | Stream processing, analytics, API reads, command dispatch |
| DynamoDB | Live sensor readings — hot path, sub 100ms reads |
| S3 | Raw data archive and analytics results store |
| API Gateway | REST API consumed by the farmer mobile app |
| Cognito | Farmer authentication via JWT tokens |
| SNS | SMS and email alerts on threshold breaches |
| EventBridge | Schedules analytics job every 6 hours |
| CloudWatch | Metrics, logs, and operational alarms |
| Terraform | All infrastructure provisioned as code |
| GitHub Actions | CI/CD — tests run and infra deploys on every push |

---

## Lambda Functions

**Stream Processor** — triggered by IoT Core on every incoming message. Writes to DynamoDB, archives to S3, checks alert thresholds.

**Analytics Job** — runs every 6 hours. Reads S3 archive and computes pH drift trends, moisture patterns, and crop yield probability. Writes results back to S3.

**Read API** — handles all GET requests from the farmer app. Queries DynamoDB and returns live readings as JSON.

**Command Handler** — handles farmer commands from the app. Validates, logs to DynamoDB, and publishes back through IoT Core to the physical hub on the farm.

---

## Data Flow

**Telemetry — farm to cloud**

Sensor node reads data → hub publishes via MQTT → IoT Core receives →

Rule Engine routes → Stream Processor Lambda → DynamoDB + S3 → SNS alert if threshold breached

**Commands — cloud to farm**

Farmer taps command in app → API Gateway → Cognito verifies JWT →

Command Handler Lambda → IoT Core → hub → valve or pump executes

---

## MQTT Topic Schema

blume/telemetry/soil/{farm_id}/{node_id}

blume/telemetry/water/{farm_id}/{tank_id}

blume/commands/{farm_id}/{device_id}

blume/status/{farm_id}/hub

