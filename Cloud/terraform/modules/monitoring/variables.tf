variable "project" {
  type        = string
  description = "Project name used for naming resources"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev, prod, etc.)"
}

variable "alert_email" {
  type        = string
  description = "Email address for SNS alerts"
}

variable "alert_phone" {
  type        = string
  description = "Phone number for SMS alerts in E.164 format"
}

variable "stream_processor_name" {
  type        = string
  description = "Lambda function name for stream processor"
}

variable "analytics_job_name" {
  type        = string
  description = "Lambda function name for analytics job"
}

variable "read_api_name" {
  type        = string
  description = "Lambda function name for read API"
}

variable "command_handler_name" {
  type        = string
  description = "Lambda function name for command handler"
}