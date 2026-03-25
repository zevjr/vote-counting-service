# Phase 02 — Backend API

This phase implements the initial backend API for the BU Election Monitor system.

The backend must support the frontend prototype created in Phase 01.

The backend will provide API endpoints that match the routes and data structures currently used in the frontend mock services.

This phase focuses only on the application backend.

Cloud infrastructure (AWS, S3, EventBridge, SQS) must NOT be implemented yet.

Create a Docker Compose file where you can run a PostgreSQL database and a Python application, allowing them to communicate with each other. The Python application should have its port exposed so it can be accessed by the frontend.

---

# Reference Documentation

The implementation must follow all project documentation and rules.

docs/product_spec.md  
docs/functional_spec.md  
docs/system_architecture.md  

.clinerules/architecture/backend.md  
.clinerules/coding/python.md  
.clinerules/database.md  
.clinerules/events.md  
.clinerules/testing/python.md  

Also consult:

docs/implementation/phase_01_frontend_prototype.md

The API must support the data needs defined by the frontend prototype.

---

# Scope of this Phase

Implement the backend application using Python.

Responsibilities:

- provide REST API endpoints
- simulate BU ingestion
- store data in PostgreSQL
- prepare integration points for the BU parser

The backend must run locally.

AWS infrastructure is not part of this phase.

---

# Backend Technology

The backend must use:

Python  
FastAPI  

Recommended stack:

FastAPI  
Pydantic  
SQLAlchemy  
Alembic  
PostgreSQL  

Project must be container-friendly user Docker.

---

# Backend Responsibilities

The backend must provide APIs for:

- BU upload registration
- BU listing
- election results aggregation
- election progress monitoring

Actual BU parsing is NOT required yet.

---

# Folder Structure

The backend must follow a modular architecture.

Suggested structure:

backend/
  app/
    api/
    services/
    repositories/
    models/
    schemas/
    parsers/
    core/
  migrations/
  tests/

---

# Parser Isolation

The BU parsing logic must be isolated behind a dedicated interface.

Create an abstract parser interface.

Example:

BUParser

Responsibilities:

- receive BU file path
- extract structured election data

Concrete implementations will be created in later phases.

Example:
```
class BUParser:
def parse(self, file_path: str) -> ParsedBU
```
For now, implement a **MockBUParser**.

---

# Database

Use PostgreSQL.

Implement initial schema.

Entities:

BoletimUrna  
Vote  
ProcessedFile

Refer to:

.clinerules/database.md

Use SQLAlchemy models.

Use Alembic for migrations.

---

# Required API Endpoints

The backend must support the frontend functionality.

---

## Health Check

GET /health

Returns API status.

---
## All other routes

**You need to look at the frontend** files to see which routes are implemented and what data they return, so you can build the backend.

---

# Mock Parsing

Since the BU parser is not implemented yet:

MockBUParser must generate simulated vote data.

Example:

- municipality
- zone
- section
- candidate votes

This allows the full system to operate before real parsing exists.

---

# Idempotency

When receiving a BU upload:

1. Calculate SHA256 file hash
2. Check if file_hash already exists
3. If yes → reject duplicate
4. If no → process

Refer to:

.clinerules/database.md

---

# Testing

Backend must include automated tests.

Use:

pytest

Tests must cover:

API endpoints  
database operations  
idempotency checks  

---

# Deliverables

The backend must produce:

- FastAPI project
- database models
- migrations
- API endpoints
- mock parser implementation
- automated tests

The backend must run locally.

Example:
```
uvicorn app.main:app --reload
```


---

# Explicit Non-Goals

The following must NOT be implemented in this phase:

AWS S3 integration  
EventBridge  
SQS queues  
Lambda workers  
Real BU parsing  
Terraform infrastructure  

These will be implemented in later phases.

---

# Expected Outcome

At the end of this phase we must have:

A working backend API capable of:

- receiving BU uploads
- simulating parsing
- storing vote data
- serving election results
- supporting the frontend prototype

---

# Documentation Requirement

After completing this phase the agent must create a technical report.

Location:

backend/docs/implementation/phase_02_backend_api.md

The document must follow the documentation rules defined in:

.clinerules/docs.md

It must explain:

- backend architecture
- database schema
- API endpoints
- parser interface
- how future agents should extend the backend

This documentation is mandatory.