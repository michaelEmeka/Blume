resource "aws_iot_thing" "central_hub" {
  name = "${var.project}-central-hub-${var.environment}"
}

resource "aws_iot_certificate" "hub_cert" {
  active = true
}

resource "aws_iot_policy" "hub_policy" {
  name = "${var.project}-hub-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["iot:Connect"]
        Resource = "arn:aws:iot:${var.region}:${var.account_id}:client/${var.project}-${var.environment}-*"
      },
      {
        Effect = "Allow"
        Action = ["iot:Publish"]
        Resource = [
          "arn:aws:iot:${var.region}:${var.account_id}:topic/${var.project}/telemetry/*",
          "arn:aws:iot:${var.region}:${var.account_id}:topic/${var.project}/status/*"
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["iot:Subscribe"]
        Resource = "arn:aws:iot:${var.region}:${var.account_id}:topicfilter/${var.project}/commands/*"
      },
      {
        Effect   = "Allow"
        Action   = ["iot:Receive"]
        Resource = "arn:aws:iot:${var.region}:${var.account_id}:topic/${var.project}/commands/*"
      }
    ]
  })
}

resource "aws_iot_thing_principal_attachment" "hub_attach" {
  thing     = aws_iot_thing.central_hub.name
  principal = aws_iot_certificate.hub_cert.arn
}

resource "aws_iot_policy_attachment" "hub_policy_attach" {
  policy = aws_iot_policy.hub_policy.name
  target = aws_iot_certificate.hub_cert.arn
}

resource "aws_cloudwatch_log_group" "iot_errors" {
  name = "/aws/iot/${var.project}/errors"
}

resource "aws_iot_topic_rule" "soil_telemetry" {
  name        = "${var.project}_soil_telemetry_${var.environment}"
  enabled     = true
  sql         = "SELECT *, topic() as mqtt_topic, timestamp() as ingestion_time FROM '${var.project}/telemetry/soil/#'"
  sql_version = "2016-03-23"

  lambda {
    function_arn = var.stream_processor_arn
  }

  error_action {
    cloudwatch_logs {
      log_group_name = aws_cloudwatch_log_group.iot_errors.name
      role_arn       = aws_iam_role.iot_logs_role.arn
    }
  }
}

resource "aws_iot_topic_rule" "water_telemetry" {
  name        = "${var.project}_water_telemetry_${var.environment}"
  enabled     = true
  sql         = "SELECT *, topic() as mqtt_topic, timestamp() as ingestion_time FROM '${var.project}/telemetry/water/#'"
  sql_version = "2016-03-23"

  lambda {
    function_arn = var.stream_processor_arn
  }

  error_action {
    cloudwatch_logs {
      log_group_name = aws_cloudwatch_log_group.iot_errors.name
      role_arn       = aws_iam_role.iot_logs_role.arn
    }
  }
}

resource "aws_lambda_permission" "iot_invoke_soil" {
  statement_id  = "AllowIoTInvokeSoil"
  action        = "lambda:InvokeFunction"
  function_name = split(":", var.stream_processor_arn)[6]
  principal     = "iot.amazonaws.com"
  source_arn    = aws_iot_topic_rule.soil_telemetry.arn
}

resource "aws_lambda_permission" "iot_invoke_water" {
  statement_id  = "AllowIoTInvokeWater"
  action        = "lambda:InvokeFunction"
  function_name = split(":", var.stream_processor_arn)[6]
  principal     = "iot.amazonaws.com"
  source_arn    = aws_iot_topic_rule.water_telemetry.arn
}

resource "aws_iam_role" "iot_logs_role" {
  name = "${var.project}-iot-logs-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "iot.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "iot_logs" {
  role       = aws_iam_role.iot_logs_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSIoTLogging"
}
