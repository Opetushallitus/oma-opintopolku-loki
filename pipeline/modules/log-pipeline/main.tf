resource "aws_cloudwatch_log_subscription_filter" "log_filter" {
  name            = "${var.project_name}-${var.event_name}-subscription-filter"
  log_group_name  = "${var.log_group_name}"
  filter_pattern  = "${var.filter_pattern}"
  destination_arn = "${aws_lambda_function.sqs_sender.arn}"
  distribution    = "ByLogStream"
}

resource "aws_iam_role" "log_sender_execution_role" {
  name_prefix = "${var.project_name}-sqs-sender"
  assume_role_policy = "${data.aws_iam_policy_document.sqs_sender_execution_policy.json}"
}

resource "aws_iam_policy" "log_sender_policy" {
  name = "${var.project_name}-sqs-sender-policy"
  description = "${var.project_name} ${var.event_name} Log SQS Sender Policy"
  policy = "${data.aws_iam_policy_document.sqs_sender_policy.json}"
}

resource "aws_iam_policy_attachment" "log_sender_policy" {
  name = "${var.project_name}-sqs-sender-policy"
  roles = ["${aws_iam_role.log_sender_execution_role.name}"]
  policy_arn = "${aws_iam_policy.log_sender_policy.arn}"
}

# TODO: Fetch Lambda artifact from S3
resource "aws_lambda_function" "sqs_sender" {
  filename         = "${var.lambda_zip_file}"
  function_name    = "${var.project_name}-${var.event_name}-sqs-sender"
  role             = "${aws_iam_role.log_sender_execution_role.arn}"
  handler          = "cloudwatch-to-sqs.handler"
  source_code_hash = "${base64sha256(file("${var.lambda_zip_file}"))}"
  runtime          = "${var.lambda_runtime}"
  timeout          = "${var.lambda_timeout}"

  environment {
    variables {
      SQS_ENDPOINT = "${aws_sqs_queue.queue.id}"
    }
  }
}

# TODO: Put region into variable
resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id   = "AllowExecutionFromCloudWatch"
  action         = "lambda:InvokeFunction"
  function_name  = "${aws_lambda_function.sqs_sender.function_name}"
  principal      = "logs.eu-west-1.amazonaws.com"
  source_arn     = "${var.log_group_arn}"
}

resource "aws_sqs_queue" "queue" {
  name                              = "${var.project_name}-${var.event_name}-queue"
  kms_master_key_id                 = "alias/aws/sqs"
  kms_data_key_reuse_period_seconds = 300
}