terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "blume-terraform-state-183088435128"
    key            = "dev/terraform.tfstate"
    region         = "eu-west-1"

    use_lockfile = false
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Blume"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}



data "aws_caller_identity" "current" {}

data "aws_iot_endpoint" "endpoint" {
  endpoint_type = "iot:Data-ATS"
}


module "security" {
  source = "${path.module}/../../modules/security"
  environment = var.environment
  project     = var.project
}

module "storage" {
  source = "${path.module}/../../modules/storage"
  environment = var.environment
  project     = var.project
  account_id  = data.aws_caller_identity.current.account_id
}

module "compute" {
  source = "${path.module}/../../modules/compute"

  environment = var.environment
  project     = var.project
  region      = var.aws_region

  soil_table_name   = module.storage.soil_table_name
  water_table_name  = module.storage.water_table_name
  farm_config_table = module.storage.farm_config_table_name
  command_log_table = module.storage.command_log_table_name

  data_lake_bucket = module.storage.data_lake_bucket
  results_bucket   = module.storage.results_bucket

  lambda_role_arn = module.security.lambda_role_arn
  iot_endpoint    = data.aws_iot_endpoint.endpoint.endpoint_address

  alert_sns_arn = module.monitoring.alert_sns_arn
}

module "iot" {
  source = "${path.module}/../../modules/iot"
  environment = var.environment
  project     = var.project
  region      = var.aws_region
  account_id  = data.aws_caller_identity.current.account_id

  stream_processor_arn = module.compute.stream_processor_arn
}

module "api" {
  source = "${path.module}/../../modules/api"
  environment = var.environment
  project     = var.project
  region      = var.aws_region

  read_api_arn        = module.compute.read_api_arn
  command_handler_arn = module.compute.command_handler_arn
}

module "monitoring" {
  source = "${path.module}/../../modules/monitoring"

  environment = var.environment
  project     = var.project

  alert_phone = "+2349060723547"
  alert_email = "tomogbonna11@gmail.com"

  stream_processor_name = module.compute.stream_processor_name
  analytics_job_name    = module.compute.analytics_job_name
  read_api_name         = module.compute.read_api_name
  command_handler_name  = module.compute.command_handler_name
}

module "scheduler" {
  source = "${path.module}/../../modules/scheduler"
  environment = var.environment
  project     = var.project

  analytics_job_arn  = module.compute.analytics_job_arn
  analytics_job_name = module.compute.analytics_job_name
}