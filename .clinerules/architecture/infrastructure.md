# Infrastructure Architecture Rules

Infrastructure must be defined using Terraform.

All cloud resources must be provisioned via Infrastructure as Code.

Manual configuration in the cloud provider is forbidden.

---

## Cloud Platform

AWS is the primary cloud provider.

Core services:

- S3
- EventBridge
- SQS
- Lambda
- RDS
- API Gateway

---

## Event-driven Architecture

File ingestion must follow an event-driven pipeline.

Flow:

S3 upload
→ EventBridge
→ SQS
→ Lambda parser

---

## Terraform Modules

Infrastructure must be organized using reusable modules.

Example structure:

infra/
  modules/
    s3
    lambda
    sqs
    rds

---

## Environments

Infrastructure must support multiple environments.

Examples:

- dev
- staging
- prod

Each environment must have its own Terraform state.

---

## Security

All services must follow least privilege principle.

IAM policies must grant minimal required permissions.