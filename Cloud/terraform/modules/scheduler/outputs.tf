output "schedule_rule_name" {
  value       = aws_cloudwatch_event_rule.analytics_schedule.name
  description = "EventBridge rule name for analytics scheduling"
}

output "schedule_rule_arn" {
  value       = aws_cloudwatch_event_rule.analytics_schedule.arn
  description = "EventBridge rule ARN for analytics scheduling"
}