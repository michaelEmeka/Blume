variable "environment" {
  type        = string
  description = "Deployment environment (dev, prod, staging)"

  validation {
    condition     = length(var.environment) > 0
    error_message = "Environment cannot be empty."
  }
}

variable "project" {
  type        = string
  description = "Project name used for resource naming"

  validation {
    condition     = length(var.project) > 0
    error_message = "Project name cannot be empty."
  }
}

variable "region" {
  type        = string
  description = "AWS region where resources are deployed"
}

variable "soil_table_name" {
  type        = string
  description = "DynamoDB table for soil sensor readings"
}

variable "water_table_name" {
  type        = string
  description = "DynamoDB table for water level readings"
}

variable "farm_config_table" {
  type        = string
  description = "DynamoDB table for farm configuration data"
}

variable "command_log_table" {
  type        = string
  description = "DynamoDB table for logging irrigation commands"
}

variable "data_lake_bucket" {
  type        = string
  description = "S3 bucket used for raw IoT telemetry storage"
}

variable "results_bucket" {
  type        = string
  description = "S3 bucket used for analytics output data"
}

variable "alert_sns_arn" {
  type        = string
  description = "SNS topic ARN for farm alerts"
}

variable "lambda_role_arn" {
  type        = string
  description = "IAM role ARN used by Lambda functions"
}

variable "iot_endpoint" {
  type        = string
  description = "AWS IoT Core data endpoint for publishing commands"
}

