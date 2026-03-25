# Backend Architecture Rules

The backend is implemented in Python and follows a modular architecture.

Framework recommendation: FastAPI.

## Directory Structure

backend/
  app/
    api/
    services/
    parser/
    models/
    repositories/
    schemas/

---

## Architectural Layers

The backend must follow a layered architecture.

### API Layer

Responsible only for:

- request validation
- response formatting
- authentication

Must NOT contain business logic.

---

### Service Layer

Contains business logic.

Examples:

- vote aggregation
- BU validation
- idempotency checks

---

### Repository Layer

Responsible for database access.

Repositories must encapsulate all SQL queries.

---

### Parser Layer

The BU parser must exist as a dedicated class.

Location:

parser/bu_parser.py

Responsibilities:

- receive BU PDF
- extract text
- parse vote data
- return structured result

The parser must not depend on database code.

---

## Event Processing

BU processing must be asynchronous.

Flow:

S3 → EventBridge → SQS → Lambda Parser → Database

---

## Idempotency

The backend must ensure idempotent processing.

Each BU must be processed once.

Strategy:

- calculate SHA256 hash
- store processed hashes
- ignore duplicates