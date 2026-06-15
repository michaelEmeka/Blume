
output "soil_table_name"       { value = aws_dynamodb_table.soil_readings.name }
output "water_table_name"      { value = aws_dynamodb_table.water_readings.name }
output "farm_config_table_name"{ value = aws_dynamodb_table.farm_config.name }
output "command_log_table_name"{ value = aws_dynamodb_table.command_log.name }
output "data_lake_bucket"      { value = aws_s3_bucket.data_lake.bucket }
output "results_bucket"        { value = aws_s3_bucket.results.bucket }