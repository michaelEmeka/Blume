variable "project" {
  type        = string
  description = "Project name used for naming resources"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev, prod, etc.)"
}

variable "analytics_job_arn" {
  type        = string
  description = "ARN of the analytics Lambda function"
}

variable "analytics_job_name" {
  type        = string
  description = "Name of the analytics Lambda function"
}