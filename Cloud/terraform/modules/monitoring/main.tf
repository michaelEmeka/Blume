# SNS Alert Topic
resource "aws_sns_topic" "alerts" {
  name = "${var.project}-alerts-${var.environment}"
}

# Email subscription (requires confirmation)
resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# SMS subscription
resource "aws_sns_topic_subscription" "sms" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "sms"
  endpoint  = var.alert_phone
}

# Stream Processor Errors Alarm
resource "aws_cloudwatch_metric_alarm" "stream_processor_errors" {
  alarm_name          = "${var.project}-stream-processor-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 5

  alarm_description = "Stream processor Lambda errors detected"
  alarm_actions     = [aws_sns_topic.alerts.arn]

  dimensions = {
    FunctionName = var.stream_processor_name
  }
}

# Analytics Job Errors Alarm
resource "aws_cloudwatch_metric_alarm" "analytics_errors" {
  alarm_name          = "${var.project}-analytics-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 3

  alarm_description = "Analytics job Lambda errors detected"
  alarm_actions     = [aws_sns_topic.alerts.arn]

  dimensions = {
    FunctionName = var.analytics_job_name
  }
}

# Read API Errors Alarm
resource "aws_cloudwatch_metric_alarm" "read_api_errors" {
  alarm_name          = "${var.project}-read-api-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 3

  alarm_description = "Read API Lambda errors detected"
  alarm_actions     = [aws_sns_topic.alerts.arn]

  dimensions = {
    FunctionName = var.read_api_name
  }
}

# Command Handler Errors Alarm
resource "aws_cloudwatch_metric_alarm" "command_handler_errors" {
  alarm_name          = "${var.project}-command-handler-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 3

  alarm_description = "Command handler Lambda errors detected"
  alarm_actions     = [aws_sns_topic.alerts.arn]

  dimensions = {
    FunctionName = var.command_handler_name
  }
}