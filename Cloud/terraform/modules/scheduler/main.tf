resource "aws_cloudwatch_event_rule" "analytics_schedule" {
  name                = "${var.project}-analytics-schedule-${var.environment}"
  description         = "Trigger analytics job every 6 hours"
  schedule_expression = "rate(6 hours)"
}

resource "aws_cloudwatch_event_target" "analytics_lambda" {
  rule      = aws_cloudwatch_event_rule.analytics_schedule.name
  target_id = "analytics-lambda"
  arn       = var.analytics_job_arn

  input = jsonencode({
    farms = [
      {
        farm_id  = "farm-001"
        node_ids = ["node-001", "node-002", "node-003"]
      }
    ]
  })
}

resource "aws_lambda_permission" "eventbridge" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.analytics_job_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.analytics_schedule.arn
}