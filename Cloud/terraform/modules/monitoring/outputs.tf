output "alert_sns_arn" {
  value       = aws_sns_topic.alerts.arn
  description = "SNS topic ARN used for system-wide alerts"
}