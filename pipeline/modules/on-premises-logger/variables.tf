variable "project_name" {
  type = "string"
}

variable "environment" {
  type = "string"
}

variable "user_name" {
  type        = "string"
  description = "Name of the IAM user that fetches the logs"
}

variable "log_stream_arns" {
  type        = "list"
  description = "ARNs of the log streams to send logs to"
  default     = []
}
