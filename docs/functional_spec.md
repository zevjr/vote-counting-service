# Functional Specification

## System Overview

The system processes Boletins de Urna through an asynchronous event-driven pipeline.

Uploaded BU PDFs are stored in object storage and processed by serverless workers that extract vote data.

The extracted data is stored in a relational database and exposed through APIs for visualization.

---

## System Components

### Frontend

Responsibilities:

- Upload BU PDFs
- Display vote aggregation
- Show BU processing status
- Display section coverage progress

---

### Upload Flow

1. User requests upload URL
2. Backend generates a signed upload URL
3. Frontend uploads BU PDF directly to object storage
4. Upload triggers event processing pipeline

---

### BU Processing Pipeline

1. PDF uploaded to storage
2. Storage event triggers message queue
3. Queue triggers processing worker
4. Worker downloads the PDF
5. Worker executes BU Parser
6. Extracted vote data is stored
7. File is moved to processed storage location

---

### Parser Module

The parser must be implemented as an isolated class responsible for interpreting BU PDFs.

The parser receives:

Input:
- PDF file

Output:
- Structured vote data

Example output structure:

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

The parser must be replaceable without modifying the rest of the system.

---

### Vote Aggregation

Votes are aggregated by:

- candidate
- office

Aggregation must support:

- total vote count
- percentage of votes
- ranking by vote total

---

### Section Monitoring

The system must track:

- total sections expected
- sections received
- sections pending

---

### Dashboard

The dashboard must display:

- aggregated vote totals
- percentage of sections processed
- vote ranking
- BU upload timeline