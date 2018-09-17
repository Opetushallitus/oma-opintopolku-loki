resource "aws_cloudwatch_log_group" "group" {
  name = "${var.log_group_name}"

  tags {
    Environment = "${var.environment}"
    Project     = "${var.project_name}"
  }
}

resource "aws_cloudwatch_log_stream" "streams" {
  count          = "${length(var.log_stream_names)}"
  name           = "${element(var.log_stream_names, count.index)}"
  log_group_name = "${aws_cloudwatch_log_group.group.name}"
}
