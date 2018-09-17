terraform {
  backend "s3" {
    bucket         = "oph-koski-remote-state"
    dynamodb_table = "oph-koski-state-lock"
    key            = "dev/oma-opintopolku-loki/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    profile        = "oph-utility"
  }
}

provider "aws" {
  region  = "eu-west-1"
  profile = "oph-koski-dev"
}
