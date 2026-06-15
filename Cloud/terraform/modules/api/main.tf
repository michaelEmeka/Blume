# Cognito User Pool
resource "aws_cognito_user_pool" "farmers" {
  name = "${var.project}-farmers-${var.environment}"

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  auto_verified_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

resource "aws_cognito_user_pool_client" "app_client" {
  name         = "${var.project}-app-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.farmers.id

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  token_validity_units {
    access_token  = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 8
  refresh_token_validity = 30
}

# API Gateway
resource "aws_api_gateway_rest_api" "blume_api" {
  name        = "${var.project}-api-${var.environment}"
  description = "Blume Precision Agriculture API"
}

resource "aws_api_gateway_authorizer" "cognito" {
  name          = "cognito-authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.blume_api.id
  provider_arns = [aws_cognito_user_pool.farmers.arn]
}

# API Resources
resource "aws_api_gateway_resource" "farms" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  parent_id   = aws_api_gateway_rest_api.blume_api.root_resource_id
  path_part   = "farms"
}

resource "aws_api_gateway_resource" "farm_id" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  parent_id   = aws_api_gateway_resource.farms.id
  path_part   = "{farm_id}"
}

resource "aws_api_gateway_resource" "soil" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  parent_id   = aws_api_gateway_resource.farm_id.id
  path_part   = "soil"
}

resource "aws_api_gateway_resource" "water" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  parent_id   = aws_api_gateway_resource.farm_id.id
  path_part   = "water"
}

resource "aws_api_gateway_resource" "commands" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  parent_id   = aws_api_gateway_resource.farm_id.id
  path_part   = "commands"
}

# Soil GET
resource "aws_api_gateway_method" "get_soil" {
  rest_api_id   = aws_api_gateway_rest_api.blume_api.id
  resource_id   = aws_api_gateway_resource.soil.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "get_soil" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  resource_id = aws_api_gateway_resource.soil.id
  http_method = aws_api_gateway_method.get_soil.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = format(
    "arn:aws:apigateway:%s:lambda:path/2015-03-31/functions/%s/invocations",
    var.region,
    var.read_api_arn
  )

  depends_on = [aws_api_gateway_method.get_soil]
}

# Water GET
resource "aws_api_gateway_method" "get_water" {
  rest_api_id   = aws_api_gateway_rest_api.blume_api.id
  resource_id   = aws_api_gateway_resource.water.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "get_water" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  resource_id = aws_api_gateway_resource.water.id
  http_method = aws_api_gateway_method.get_water.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = format(
    "arn:aws:apigateway:%s:lambda:path/2015-03-31/functions/%s/invocations",
    var.region,
    var.read_api_arn
  )

  depends_on = [aws_api_gateway_method.get_water]
}

# Command POST
resource "aws_api_gateway_method" "post_command" {
  rest_api_id   = aws_api_gateway_rest_api.blume_api.id
  resource_id   = aws_api_gateway_resource.commands.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "post_command" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id
  resource_id = aws_api_gateway_resource.commands.id
  http_method = aws_api_gateway_method.post_command.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = format(
    "arn:aws:apigateway:%s:lambda:path/2015-03-31/functions/%s/invocations",
    var.region,
    var.command_handler_arn
  )

  depends_on = [aws_api_gateway_method.post_command]
}

# Lambda permissions
resource "aws_lambda_permission" "apigw_read_api" {
  statement_id  = "AllowAPIGatewayReadAPI"
  action        = "lambda:InvokeFunction"
  function_name = var.read_api_arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.blume_api.execution_arn}/*/GET/farms/*/soil"
}

resource "aws_lambda_permission" "apigw_read_api_water" {
  statement_id  = "AllowAPIGatewayReadAPIWater"
  action        = "lambda:InvokeFunction"
  function_name = var.read_api_arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.blume_api.execution_arn}/*/GET/farms/*/water"
}

resource "aws_lambda_permission" "apigw_command_handler" {
  statement_id  = "AllowAPIGatewayCommandHandler"
  action        = "lambda:InvokeFunction"
  function_name = var.command_handler_arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.blume_api.execution_arn}/*/POST/farms/*/commands"
}

# Deployment
resource "aws_api_gateway_deployment" "blume_api" {
  rest_api_id = aws_api_gateway_rest_api.blume_api.id

  triggers = {
    redeploy = sha1(jsonencode([
      aws_api_gateway_resource.soil.id,
      aws_api_gateway_resource.water.id,
      aws_api_gateway_resource.commands.id
    ]))
  }

  depends_on = [
    aws_api_gateway_integration.get_soil,
    aws_api_gateway_integration.get_water,
    aws_api_gateway_integration.post_command
  ]
}

resource "aws_api_gateway_stage" "dev" {
  deployment_id = aws_api_gateway_deployment.blume_api.id
  rest_api_id   = aws_api_gateway_rest_api.blume_api.id
  stage_name    = var.environment
}
