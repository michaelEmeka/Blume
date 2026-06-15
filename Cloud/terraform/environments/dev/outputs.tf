output "api_url" {
  description = "Base URL for the Blume API"
  value       = module.api.api_url
}

output "iot_endpoint" {
  description = "IoT Core MQTT endpoint"
  value       = data.aws_iot_endpoint.endpoint.endpoint_address
}

output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.api.user_pool_id
}

output "user_pool_client_id" {
  description = "Cognito App Client ID"
  value       = module.api.user_pool_client
}

output "soil_table_name" {
  description = "DynamoDB soil readings table"
  value       = module.storage.soil_table_name
}

output "water_table_name" {
  description = "DynamoDB water readings table"
  value       = module.storage.water_table_name
}

output "data_lake_bucket" {
  description = "S3 data lake bucket name"
  value       = module.storage.data_lake_bucket
}

output "results_bucket" {
  description = "S3 analytics results bucket name"
  value       = module.storage.results_bucket
}

output "alert_sns_arn" {
  description = "SNS alerts topic ARN"
  value       = module.monitoring.alert_sns_arn
}
output "iot_cert_pem" {
  description = "IoT device certificate"
  value       = module.iot.cert_pem
  sensitive   = true
}

output "iot_private_key" {
  description = "IoT device private key"
  value       = module.iot.private_key
  sensitive   = true
}

output "iot_public_key" {
  description = "IoT device public key"
  value       = module.iot.public_key
  sensitive   = true
}
