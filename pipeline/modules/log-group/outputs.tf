output "log_group_arn" {
  value = "${aws_cloudwatch_log_group.group.arn}"
}

output "log_group_name" {
  value = "${aws_cloudwatch_log_group.group.name}"
}

output "log_stream_arns" {
  value = "${aws_cloudwatch_log_stream.streams.*.arn}"
}
