#!/bin/bash
set -e

# Configuration values
FARM_ID="farm-001"
NODE_ID="node-001"
TANK_ID="tank-001"

API_URL="${API_URL:-https://21e9wecy7e.execute-api.eu-west-1.amazonaws.com/dev}"

USER_POOL_CLIENT_ID="7fmq92cvdo4qe5arj8fso33gmd"
REGION="eu-west-1"

USERNAME="testfarmer"
PASSWORD="FarmerPass123!"

# Check required tools
command -v aws >/dev/null 2>&1 || { echo "AWS CLI not installed"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "curl not installed"; exit 1; }

if command -v jq >/dev/null 2>&1; then
  JSON_TOOL=(jq .)
elif command -v python3 >/dev/null 2>&1; then
  JSON_TOOL=(python3 -m json.tool)
elif command -v python >/dev/null 2>&1; then
  JSON_TOOL=(python -m json.tool)
else
  echo "jq not installed and no Python JSON fallback available"; exit 1;
fi

echo "Step 1: Authenticating with Cognito"

TOKEN=$(aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME="$USERNAME",PASSWORD="$PASSWORD" \
  --client-id "$USER_POOL_CLIENT_ID" \
  --region "$REGION" \
  --query 'AuthenticationResult.AccessToken' \
  --output text 2>/dev/null || true)

if [[ -z "$TOKEN" || "$TOKEN" == "None" ]]; then
  echo "Authentication failed"
  exit 1
fi

echo "Authentication successful"

echo "Step 2: Query soil readings"

curl -s -H "Authorization: Bearer $TOKEN" \
  "$API_URL/farms/$FARM_ID/soil?node_id=$NODE_ID" | "${JSON_TOOL[@]}"

echo "Step 3: Query water readings"

curl -s -H "Authorization: Bearer $TOKEN" \
  "$API_URL/farms/$FARM_ID/water?tank_id=$TANK_ID" | "${JSON_TOOL[@]}"

echo "Step 4: Send command"

curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\": \"VALVE_OPEN\",
    \"farm_id\": \"$FARM_ID\",
    \"target\": \"$NODE_ID\"
  }" \
  "$API_URL/farms/$FARM_ID/commands" | "${JSON_TOOL[@]}"

echo "Test completed"