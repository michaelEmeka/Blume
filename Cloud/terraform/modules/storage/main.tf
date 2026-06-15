
# Soil readings table
resource "aws_dynamodb_table" "soil_readings" {
  name         = "${var.project}-soil-readings-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "farm_node_id"
  range_key    = "timestamp"

  attribute {
    name = "farm_node_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  ttl {
    attribute_name = "ttl_expiry"
    enabled        = true
  }
}

# Water readings table
resource "aws_dynamodb_table" "water_readings" {
  name         = "${var.project}-water-readings-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "farm_tank_id"
  range_key    = "timestamp"

  attribute {
    name = "farm_tank_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  ttl {
    attribute_name = "ttl_expiry"
    enabled        = true
  }
}

# Command audit log
resource "aws_dynamodb_table" "command_log" {
  name         = "${var.project}-command-log-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "command_id"
  range_key    = "timestamp"

  attribute {
    name = "command_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  ttl {
    attribute_name = "ttl_expiry"
    enabled        = true
  }
}

# Farm config table
resource "aws_dynamodb_table" "farm_config" {
  name         = "${var.project}-farm-config-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "farm_id"

  attribute {
    name = "farm_id"
    type = "S"
  }

  ttl {
    attribute_name = "ttl_expiry"
    enabled        = true
  }
}

resource "aws_s3_bucket" "data_lake" {
  bucket = "${var.project}-${var.environment}-data-lake"
}

resource "aws_s3_bucket_public_access_block" "data_lake" {
  bucket                  = aws_s3_bucket.data_lake.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Results Bucket
resource "aws_s3_bucket" "results" {
  bucket = "${var.project}-${var.environment}-results"
}

resource "aws_s3_bucket_public_access_block" "results" {
  bucket                  = aws_s3_bucket.results.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}