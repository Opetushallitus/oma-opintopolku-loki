variable "project_name" {
  type = "string"
}

variable "environment" {
  type = "string"
}

variable "log_group_name" {
  type = "string"
}

variable "log_group_arn" {
  type = "string"
}

variable "event_name" {
  type = "string"
}

variable "filter_pattern" {
  type = "string"
}

variable "lambda_zip_file" {
  type = "string"
}

variable "lambda_runtime" {
  type = "string"
}

variable "lambda_timeout" {
  default = 60
}