
output "lambda_role_arn"   { value = aws_iam_role.lambda_role.arn }
output "lambda_role_name"  { value = aws_iam_role.lambda_role.name }
output "iot_rule_role_arn" { value = aws_iam_role.iot_rule_role.arn }