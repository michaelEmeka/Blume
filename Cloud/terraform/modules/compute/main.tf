locals {
  lambda_runtime = "python3.11"
  lambda_timeout = 30

  lambda_base_path = abspath("${path.module}/../../../lambdas")
}

data "archive_file" "stream_processor" {
  type        = "zip"
  source_dir  = "${local.lambda_base_path}/stream_processor"
  output_path = "${path.module}/packages/stream_processor.zip"
}

data "archive_file" "analytics_job" {
  type        = "zip"
  source_dir  = "${local.lambda_base_path}/analytics_job"
  output_path = "${path.module}/packages/analytics_job.zip"
}

data "archive_file" "read_api" {
  type        = "zip"
  source_dir  = "${local.lambda_base_path}/read_api"
  output_path = "${path.module}/packages/read_api.zip"
}

data "archive_file" "command_handler" {
  type        = "zip"
  source_dir  = "${local.lambda_base_path}/command_handler"
  output_path = "${path.module}/packages/command_handler.zip"
}

resource "aws_lambda_function" "stream_processor" {
  filename         = data.archive_file.stream_processor.output_path
  function_name    = "${var.project}-stream-processor-${var.environment}"
  role             = var.lambda_role_arn
  handler          = "handler.lambda_handler"
  runtime          = local.lambda_runtime
  timeout          = local.lambda_timeout
  source_code_hash = data.archive_file.stream_processor.output_base64sha256

  environment {
    variables = {
      SOIL_TABLE       = var.soil_table_name
      WATER_TABLE      = var.water_table_name
      DATA_LAKE_BUCKET = var.data_lake_bucket
      ALERT_SNS_ARN    = var.alert_sns_arn
    }
  }
}

resource "aws_lambda_function" "analytics_job" {
  filename         = data.archive_file.analytics_job.output_path
  function_name    = "${var.project}-analytics-job-${var.environment}"
  role             = var.lambda_role_arn
  handler          = "handler.lambda_handler"
  runtime          = local.lambda_runtime
  timeout          = 300
  memory_size      = 512
  source_code_hash = data.archive_file.analytics_job.output_base64sha256

  environment {
    variables = {
      SOIL_TABLE     = var.soil_table_name
      RESULTS_BUCKET = var.results_bucket
    }
  }
}

resource "aws_lambda_function" "read_api" {
  filename         = data.archive_file.read_api.output_path
  function_name    = "${var.project}-read-api-${var.environment}"
  role             = var.lambda_role_arn
  handler          = "handler.lambda_handler"
  runtime          = local.lambda_runtime
  timeout          = local.lambda_timeout
  source_code_hash = data.archive_file.read_api.output_base64sha256

  environment {
    variables = {
      SOIL_TABLE  = var.soil_table_name
      WATER_TABLE = var.water_table_name
    }
  }
}

resource "aws_lambda_function" "command_handler" {
  filename         = data.archive_file.command_handler.output_path
  function_name    = "${var.project}-command-handler-${var.environment}"
  role             = var.lambda_role_arn
  handler          = "handler.lambda_handler"
  runtime          = local.lambda_runtime
  timeout          = local.lambda_timeout
  source_code_hash = data.archive_file.command_handler.output_base64sha256

  environment {
    variables = {
      COMMAND_LOG_TABLE = var.command_log_table
      IOT_ENDPOINT      = var.iot_endpoint
    }
  }
}

resource "aws_cloudwatch_log_group" "stream_processor" {
  name              = "/aws/lambda/${aws_lambda_function.stream_processor.function_name}"
  retention_in_days = 14
  depends_on        = [aws_lambda_function.stream_processor]
}

resource "aws_cloudwatch_log_group" "analytics_job" {
  name              = "/aws/lambda/${aws_lambda_function.analytics_job.function_name}"
  retention_in_days = 14
  depends_on        = [aws_lambda_function.analytics_job]
}

resource "aws_cloudwatch_log_group" "read_api" {
  name              = "/aws/lambda/${aws_lambda_function.read_api.function_name}"
  retention_in_days = 14
  depends_on        = [aws_lambda_function.read_api]
}

resource "aws_cloudwatch_log_group" "command_handler" {
  name              = "/aws/lambda/${aws_lambda_function.command_handler.function_name}"
  retention_in_days = 14
  depends_on        = [aws_lambda_function.command_handler]
}