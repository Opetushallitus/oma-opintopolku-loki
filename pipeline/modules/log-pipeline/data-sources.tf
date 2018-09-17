data "aws_iam_policy_document" "sqs_sender_execution_policy" {
  statement {
    effect = "Allow"

    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type = "Service"
      identifiers = [
        "edgelambda.amazonaws.com",
        "lambda.amazonaws.com"
      ]
    }
  }
}

data "aws_iam_policy_document" "sqs_sender_policy" {
  statement {
    sid = "AllowCloudWatchLogging"
    effect = "Allow"

    actions = [
      "logs:PutLogEvents",
      "logs:CreateLogStream",
      "logs:CreateLogGroup",
      "logs:DescribeLogStreams"
    ]

    resources = [
      "arn:aws:logs:*:*:*"
    ]
  }

  statement{
    sid = "AllowSendingMessagesToSQS"
    effect = "Allow"

    actions = [
      "sqs:SendMessage"
    ]

    resources = [
      "${aws_sqs_queue.queue.arn}"
    ]
  }
}