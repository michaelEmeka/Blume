data "aws_region" "current" {}

resource "aws_iam_role" "lambda_role" {
  name = "${var.project}-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Basic Lambda logging
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# DynamoDB access (optimized scope)
resource "aws_iam_policy" "lambda_dynamodb" {
  name = "${var.project}-lambda-dynamodb-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
      ]
      Resource = "arn:aws:dynamodb:${data.aws_region.current.name}:*:table/${var.project}-*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb.arn
}

# S3 access (clean scoped policy)
resource "aws_iam_policy" "lambda_s3" {
  name = "${var.project}-lambda-s3-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ]
      Resource = [
        "arn:aws:s3:::${var.project}-*",
        "arn:aws:s3:::${var.project}-*/*"
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_s3" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3.arn
}

# SNS access
resource "aws_iam_policy" "lambda_sns" {
  name = "${var.project}-lambda-sns-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["sns:Publish"]
      Resource = "arn:aws:sns:${data.aws_region.current.name}:*:${var.project}-*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_sns" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_sns.arn
}

# IoT publish access (scoped region)
resource "aws_iam_policy" "lambda_iot" {
  name = "${var.project}-lambda-iot-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["iot:Publish"]
      Resource = "arn:aws:iot:${data.aws_region.current.name}:*:topic/${var.project}/*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_iot" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_iot.arn
}

# IAM Role for IoT Rule Engine
resource "aws_iam_role" "iot_rule_role" {
  name = "${var.project}-iot-rule-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "iot.amazonaws.com" }
    }]
  })
}

# IoT -> Lambda invoke permission (scoped)
resource "aws_iam_policy" "iot_invoke_lambda" {
  name = "${var.project}-iot-invoke-lambda-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["lambda:InvokeFunction"]
      Resource = "arn:aws:lambda:${data.aws_region.current.name}:*:function:${var.project}-*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "iot_invoke_lambda" {
  role       = aws_iam_role.iot_rule_role.name
  policy_arn = aws_iam_policy.iot_invoke_lambda.arn
}