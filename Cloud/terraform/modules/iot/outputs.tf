output "thing_name" {
  value = aws_iot_thing.central_hub.name
}

output "cert_arn" {
  value = aws_iot_certificate.hub_cert.arn
}



output "cert_pem" {
  description = "IoT device certificate"
  value       = aws_iot_certificate.hub_cert.certificate_pem
  sensitive   = true
}

output "private_key" {
  description = "IoT device private key"
  value       = aws_iot_certificate.hub_cert.private_key
  sensitive   = true
}

output "public_key" {
  description = "IoT device public key"
  value       = aws_iot_certificate.hub_cert.public_key
  sensitive   = true
}