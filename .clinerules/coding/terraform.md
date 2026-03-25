# Terraform Coding Standards

All infrastructure must be defined using Terraform.

---

## Version

Terraform 1.5+

---

## Module Usage

Always prefer reusable modules.

Avoid defining resources directly in root configuration.

---

## Naming Convention

Resource names must be descriptive and environment-aware.

Example:

project-env-service-resource

---

## State Management

Use remote state backend.

Example:

S3 + DynamoDB locking.

---

## Variables

All configurable values must be exposed through variables.

Avoid hardcoded values.