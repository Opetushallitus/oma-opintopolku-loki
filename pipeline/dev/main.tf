module "log_group" {
  source = "../modules/log-group"

  project_name     = "oma-opintopolku-loki"
  environment      = "dev"
  log_group_name   = "oma-opintopolku-audit-loki"
  log_stream_names = ["koski"]
}

module "koski_on_premises_logger" {
  source = "../modules/on-premises-logger"

  project_name    = "oma-opintopolku-loki"
  environment     = "dev"
  user_name       = "koski-log-fetcher"
  log_stream_arns = "${module.log_group.log_stream_arns}"
}

module "log_pipeline" {
  source = "../modules/log-pipeline"

  project_name = "oma-opintopolku-loki"
  environment  = "dev"

  log_group_name  = "${module.log_group.log_group_name}"
  log_group_arn   = "${module.log_group.log_group_arn}"
  event_name      = "audit"
  filter_pattern  = "{ $.type != \"alive\" }"
  lambda_zip_file = "../cloudwatch-to-sqs/cloudwatch-to-sqs.zip"
  lambda_runtime  = "python3.6"
}
