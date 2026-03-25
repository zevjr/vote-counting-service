# Event Processing Rules

The system uses an event-driven architecture for processing Boletim de Urna (BU) files.

Events are used to decouple file ingestion from processing logic.

All event-driven components must follow strict reliability and idempotency rules.

---

# Event Flow

The BU processing pipeline follows this flow:

Frontend Upload
→ S3 Object Storage
→ EventBridge
→ SQS Queue
→ Lambda Parser
→ PostgreSQL

This architecture ensures asynchronous and scalable processing.

---

# Event Sources

The primary event source is S3 object creation.

When a BU PDF is uploaded:

S3 emits an object created event.

This event is routed via EventBridge to an SQS queue.

---

# Queue Usage

SQS acts as a buffer between storage and processing workers.

Responsibilities:

- absorb bursts of uploads
- ensure reliable delivery
- enable retry logic

The queue must use at-least-once delivery semantics.

---

# Idempotent Event Processing

Because SQS guarantees at-least-once delivery, duplicate events may occur.

The system must be fully idempotent.

Parser workers must verify if a file has already been processed.

Duplicate processing must never affect vote totals.

---

# Event Message Structure

Queue messages must contain minimal metadata required for processing.

Example message payload:

{
  "bucket": "string",
  "key": "string",
  "timestamp": "datetime"
}

The worker must retrieve the file directly from S3.

Events must not contain the full document payload.

---

# Worker Responsibilities

Lambda parser workers must perform the following steps:

1. Receive event from queue
2. Retrieve BU PDF from S3
3. Calculate file hash
4. Check idempotency
5. Execute BUParser
6. Persist extracted data
7. Move file to processed folder
8. Acknowledge queue message

If parsing fails:

- move file to failed/ folder
- log error
- do not reprocess automatically

---

# Event Isolation

Workers must be stateless.

Each event must be processed independently.

Workers must not rely on in-memory state between executions.

---

# Retry Strategy

SQS retry policies must be configured.

Recommended strategy:

- retry failed events a limited number of times
- move permanently failing events to a dead-letter queue

Dead-letter queues must be monitored.

---

# Observability

Event processing must produce logs containing:

- event id
- S3 object key
- file hash
- municipality
- zone
- section
- processing status

These logs enable traceability of each BU through the system.

---

# Event Contract Stability

The event message schema must remain stable.

If the event schema changes:

- version the event payload
- maintain backward compatibility

Breaking event changes must be avoided.