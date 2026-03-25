# System Architecture

## Overview

This system follows an event-driven, serverless architecture on AWS.

It is designed to ingest Boletim de Urna (BU) PDFs, process them asynchronously, extract structured vote data, and provide aggregated results for visualization.

---

## High-Level Flow

1. User uploads BU PDF via frontend
2. File is stored in S3 (raw bucket)
3. S3 triggers an event
4. Event is routed through EventBridge
5. Event is sent to SQS queue
6. Lambda parser consumes the queue
7. Parser extracts vote data
8. Data is stored in PostgreSQL (RDS)
9. File is moved to processed storage
10. API layer exposes aggregated data
11. Frontend displays results

---

## Architecture Diagram (Logical)

Frontend
   ↓
S3 (raw)
   ↓
EventBridge
   ↓
SQS
   ↓
Lambda Parser
   ↓
RDS (PostgreSQL)
   ↓
API (Lambda + API Gateway)
   ↓
Frontend Dashboard

---

## Components

### 1. Frontend

Responsibilities:

- Upload BU PDFs using signed URLs
- Display aggregated vote results
- Show processing status
- Show section coverage

---

### 2. Object Storage (S3)

Buckets structure:

- raw/
- processing/
- processed/
- failed/

Responsibilities:

- Store uploaded PDFs
- Trigger processing events

---

### 3. Event Routing

Uses EventBridge to route S3 events to SQS.

Responsibilities:

- Decouple storage from processing
- Enable flexible event handling

---

### 4. Queue (SQS)

Responsibilities:

- Buffer incoming processing requests
- Ensure reliable delivery
- Control processing rate

Message structure:

{
  "bucket": "string",
  "key": "string",
  "timestamp": "datetime"
}

---

### 5. Parser Worker (Lambda)

Responsibilities:

- Consume SQS messages
- Download PDF from S3
- Calculate file hash (SHA256)
- Validate idempotency
- Execute BUParser class
- Persist extracted data in RDS
- Move file to processed/ or failed/

---

### 6. Parser Module (Critical Component)

Location:

backend/app/parser/bu_parser.py

Design constraints:

- Must be implemented as a single class
- Must be fully isolated
- Must not depend on external business logic

Interface:

Input:
- PDF file

Output:
{
  municipality: string,
  zone: number,
  section: number,
  votes: [
    {
      office: string,
      candidate_number: string,
      candidate_name: string,
      votes: integer
    }
  ]
}

---

### 7. Database (RDS - PostgreSQL)

Responsibilities:

- Store BU metadata
- Store extracted votes
- Support aggregation queries

Core tables:

boletim_urna
votes
processed_files

---

### 8. API Layer

Implemented via Lambda + API Gateway.

Responsibilities:

- Provide aggregated vote data
- Provide BU processing status
- Provide section coverage metrics

Endpoints:

GET /results
GET /progress
GET /sections
POST /upload-url

---

## Data Flow Details

### Upload Flow

Frontend → Backend → Signed URL → S3 upload

---

### Processing Flow

S3 upload → EventBridge → SQS → Lambda Parser

---

### Data Persistence Flow

Lambda Parser → PostgreSQL

---

### Query Flow

Frontend → API Gateway → Lambda → PostgreSQL

---

## Idempotency Strategy

Each uploaded file must be processed only once.

Steps:

1. Calculate SHA256 hash of the file
2. Check if hash exists in processed_files table
3. If exists → ignore message
4. If not → process and store hash

---

## BU Uniqueness Constraint

Each BU must be unique by:

municipality + zone + section

If a duplicate is detected:

- Reject processing OR
- Flag for manual review

---

## Error Handling

If parsing fails:

- Move file to failed/ folder
- Log error details
- Do not retry automatically

---

## Scalability

The system scales automatically through:

- SQS buffering
- Lambda concurrency
- Stateless processing

---

## Observability

The system must log:

- upload timestamp
- processing timestamp
- file hash
- parsing success/failure
- section identifiers

---

## Security

- Uploads must use signed URLs
- APIs must require authentication
- No direct public access to storage

---

## Future Extensions

- QR Code parsing (if accessible)
- Multi-municipality support
- Real-time dashboards (WebSockets)
- Data reconciliation with official sources