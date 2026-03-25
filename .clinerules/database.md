# Database Rules

All persistent data must be stored in a relational database using PostgreSQL.

The database is the source of truth for all processed Boletim de Urna (BU) data.

The database must be designed to support reliable ingestion, deduplication, and aggregation of vote data.

---

# Database Technology

Database engine:

PostgreSQL

The database must run on a managed relational service such as Amazon RDS.

Direct file-based databases (e.g. SQLite) must not be used in production.

---

# Schema Design Principles

All schemas must follow these principles:

1. Normalized data structures
2. Clear primary keys
3. Explicit foreign keys
4. Unique constraints where appropriate
5. No duplicated vote data

Each table must represent a well-defined entity.

---

# Core Entities

The database must contain at least the following entities.

## BoletimUrna

Represents a single BU document.

Fields:

- id
- municipality
- zone
- section
- file_hash
- s3_key
- created_at

Constraints:

- municipality + zone + section must be unique

This ensures a voting section cannot be processed more than once.

---

## Vote

Represents votes extracted from a BU.

Fields:

- id
- boletim_urna_id
- office
- candidate_number
- candidate_name
- vote_count

Foreign key:

vote.boletim_urna_id → boletim_urna.id

---

## ProcessedFile

Tracks processed files for idempotency.

Fields:

- id
- file_hash
- processed_at

Constraints:

file_hash must be unique.

---

# Idempotency Rules

The system must prevent duplicate BU processing.

Before processing a file:

1. Calculate SHA256 hash
2. Check if hash exists in ProcessedFile
3. If exists → ignore event
4. If not → process file and store hash

---

# Database Access Rules

All database access must be performed through a repository layer.

Direct SQL queries inside business logic are forbidden.

Example architecture:

services → repositories → database

Repositories are responsible for:

- queries
- inserts
- updates
- transactions

---

# Transactions

Critical operations must use database transactions.

Example:

BU processing must atomically:

1. Insert boletim_urna
2. Insert vote rows
3. Insert processed file hash

If any step fails, the transaction must roll back.

---

# Query Design

Queries must be optimized for aggregation.

Common queries include:

- vote totals by candidate
- vote totals by office
- processed section coverage

Indexes must exist for:

- municipality
- zone
- section
- candidate_number

---

# Migrations

Database schema changes must be managed using migrations.

Recommended tools:

- Alembic
- SQLAlchemy migrations

Manual schema modifications in production are forbidden.

---

# Data Integrity

All vote data must remain immutable after ingestion.

Updates to vote counts are forbidden.

If a correction is required:

- mark the BU as invalid
- reprocess with corrected data