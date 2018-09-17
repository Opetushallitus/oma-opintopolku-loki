resource "aws_iam_user" "log_fetcher" {
  name = "${var.user_name}"
}

resource "aws_iam_policy" "log_fetcher" {
  name_prefix = "${var.user_name}-policy"
  description = "${var.project_name} ${var.user_name} IAM User Policy"

  policy = "${data.aws_iam_policy_document.log_fetcher.json}"
}

resource "aws_iam_user_policy_attachment" "log_fetcher" {
  user       = "${aws_iam_user.log_fetcher.name}"
  policy_arn = "${aws_iam_policy.log_fetcher.arn}"
}
