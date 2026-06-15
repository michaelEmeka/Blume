output "stream_processor_arn" {
  value       = aws_lambda_function.stream_processor.arn
  description = "ARN of the IoT stream processor Lambda"
}

output "stream_processor_name" {
  value       = aws_lambda_function.stream_processor.function_name
  description = "Name of the IoT stream processor Lambda"
}

output "analytics_job_arn" {
  value       = aws_lambda_function.analytics_job.arn
  description = "ARN of the scheduled analytics Lambda job"
}

output "analytics_job_name" {
  value       = aws_lambda_function.analytics_job.function_name
  description = "Name of the analytics job Lambda"
}

output "read_api_arn" {
  value       = aws_lambda_function.read_api.arn
  description = "ARN of the REST API Lambda for data retrieval"
}

output "read_api_name" {
  value       = aws_lambda_function.read_api.function_name
  description = "Name of the REST API Lambda for data retrieval"
}

output "command_handler_arn" {
  value       = aws_lambda_function.command_handler.arn
  description = "ARN of the IoT command handler Lambda"
}

output "command_handler_name" {
  value       = aws_lambda_function.command_handler.function_name
  description = "Name of the IoT command handler Lambda"
}