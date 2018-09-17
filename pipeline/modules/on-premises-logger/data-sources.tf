data "aws_iam_policy_document" "log_fetcher" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["${var.log_stream_arns}"]
  }
}
