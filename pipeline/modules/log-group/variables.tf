variable "project_name" {
  type = "string"
}

variable "environment" {
  type = "string"
}

variable "log_group_name" {
  type        = "string"
  description = "Name of the CloudWatch Log Group where the logs are stored"
}

variable "log_stream_names" {
  type        = "list"
  description = "Names of the log streams in the log group"
  default     = []
}
