output "api_url" {
  value       = "https://${aws_api_gateway_rest_api.blume_api.id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_stage.dev.stage_name}"
  description = "Base URL of the Blume API Gateway"
}

output "api_id" {
  value       = aws_api_gateway_rest_api.blume_api.id
  description = "API Gateway REST API ID"
}

output "stage_name" {
  value       = aws_api_gateway_stage.dev.stage_name
  description = "Deployment stage name for the API"
}

output "user_pool_id" {
  value       = aws_cognito_user_pool.farmers.id
  description = "Cognito User Pool ID for authentication"
}

output "user_pool_client" {
  value       = aws_cognito_user_pool_client.app_client.id
  description = "Cognito App Client ID used by frontend"
}