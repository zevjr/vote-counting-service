# Phase 02 — Backend API

## Overview

This phase implements the complete backend API for the BU Monitor system using Python + FastAPI + PostgreSQL. The backend supports all data needs of the Phase 01 frontend prototype and provides a foundation for future AWS integration.

Key deliverables:
- REST API with 7 endpoints matching frontend service calls
- PostgreSQL schema with 3 tables (BoletimUrna, Vote, ProcessedFile)
- Alembic migrations
- MockBUParser for simulated vote data
- Docker Compose for local development
- 21 automated tests (100% passing)

---

## Architecture Decisions

### FastAPI + SQLAlchemy + Alembic
FastAPI was chosen for its async support, automatic OpenAPI docs, and Pydantic integration. SQLAlchemy provides the ORM layer with full type safety. Alembic manages schema migrations.

### Layered Architecture
```
API Layer (FastAPI routers)
    ↓
Service Layer (BUService)
    ↓
Repository Layer (BoletimUrnaRepository, VoteRepository, ProcessedFileRepository)
    ↓
Database (PostgreSQL via SQLAlchemy)
```

Business logic is isolated in the service layer. Repositories encapsulate all SQL. API controllers only validate input and format output.

### MockBUParser
The `MockBUParser` implements the `BUParser` abstract interface. It generates deterministic vote data based on the MD5 hash of the file path. This allows the full system to operate before real PDF parsing is implemented. Replace only `MockBUParser` in Phase 03 — no other code changes required.

### Idempotency
Two-layer idempotency:
1. **File hash check**: SHA256 hash stored in `ProcessedFile`. Duplicate files are rejected before parsing.
2. **Section uniqueness**: `municipality + zone + section` unique constraint in `BoletimUrna`. Prevents duplicate sections even with different files.

### SQLite for Tests
Tests use SQLite in-memory via `conftest.py`. The timeline query was rewritten using SQLAlchemy ORM (instead of raw PostgreSQL SQL) to remain database-agnostic.

### Docker Compose
PostgreSQL 16 + FastAPI backend in separate containers. The backend waits for the database healthcheck before starting. Alembic migrations run automatically on container startup.

---

## Folder Structure

```
backend/
├── Dockerfile
├── alembic.ini
├── pytest.ini
├── pyproject.toml
├── poetry.lock
├── .env
├── app/
│   ├── main.py                          # FastAPI app entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── health.py                    # GET /health
│   │   ├── boletins.py                  # GET /api/v1/boletins
│   │   ├── upload.py                    # POST /api/v1/upload
│   │   ├── dashboard.py                 # GET /api/v1/dashboard/*
│   │   └── results.py                   # GET /api/v1/results
│   ├── services/
│   │   └── bu_service.py                # BUService (business logic)
│   ├── repositories/
│   │   ├── boletim_urna_repository.py
│   │   ├── vote_repository.py
│   │   └── processed_file_repository.py
│   ├── models/
│   │   ├── __init__.py                  # Imports all models for Alembic
│   │   ├── boletim_urna.py              # BoletimUrna SQLAlchemy model
│   │   ├── vote.py                      # Vote SQLAlchemy model
│   │   └── processed_file.py            # ProcessedFile SQLAlchemy model
│   ├── schemas/
│   │   ├── boletim_urna.py              # Pydantic schemas for BU
│   │   ├── vote.py                      # Pydantic schemas for votes/results
│   │   ├── dashboard.py                 # Pydantic schemas for dashboard
│   │   └── upload.py                    # Pydantic schema for upload response
│   ├── parsers/
│   │   ├── base.py                      # BUParser abstract interface + ParsedBU
│   │   └── mock_bu_parser.py            # MockBUParser implementation
│   └── core/
│       ├── config.py                    # Settings (pydantic-settings)
│       └── database.py                  # SQLAlchemy engine + session + Base
├── migrations/
│   ├── env.py                           # Alembic environment (imports all models)
│   ├── script.py.mako
│   └── versions/                        # Migration files (auto-generated)
├── tests/
│   ├── conftest.py                      # Shared fixtures (SQLite test DB)
│   ├── unit/
│   │   └── test_mock_bu_parser.py       # 9 unit tests for MockBUParser
│   └── integration/
│       ├── test_api_health.py           # 1 test
│       ├── test_api_boletins.py         # 5 tests
│       └── test_api_dashboard.py        # 6 tests
└── docs/
    └── implementation/
        └── phase_02_backend_api.md      # This file
```

---

## Key Components

### BUParser (Abstract Interface)
**Location**: `app/parsers/base.py`

```python
class BUParser(ABC):
    @abstractmethod
    def parse(self, file_path: str) -> ParsedBU: ...
```

`ParsedBU` contains: `municipality`, `zone`, `section`, `votes: list[ParsedVote]`.

`ParsedVote` contains: `office`, `candidate_number`, `candidate_name`, `party`, `vote_count`.

**Rule**: Only `BUParser` subclasses may parse BU documents. No other module may parse PDFs.

### MockBUParser
**Location**: `app/parsers/mock_bu_parser.py`

Generates deterministic vote data using MD5 hash of the file path as a seed. Produces votes for 3 offices: Presidente, Governador, Senador. Replace this class in Phase 03 with a real PDF parser.

### BUService
**Location**: `app/services/bu_service.py`

Central business logic class. Injected with a `BUParser` instance (defaults to `MockBUParser`). Orchestrates:
- Upload flow (hash → idempotency → parse → persist atomically)
- Boletins listing
- Dashboard stats
- Section coverage
- Upload timeline
- Aggregated results

### Repositories
| Repository | Responsibility |
|---|---|
| `BoletimUrnaRepository` | CRUD for BoletimUrna, status counts, timeline |
| `VoteRepository` | Bulk insert votes, aggregated results query |
| `ProcessedFileRepository` | Idempotency hash check and insert |

### API Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/v1/boletins` | List all BUs |
| POST | `/api/v1/upload` | Upload BU PDF |
| GET | `/api/v1/dashboard/stats` | Dashboard statistics |
| GET | `/api/v1/dashboard/coverage` | Section coverage |
| GET | `/api/v1/dashboard/timeline` | Upload timeline (last 24h) |
| GET | `/api/v1/results` | Aggregated vote results |

---

## Data Model

### BoletimUrna
| Field | Type | Notes |
|---|---|---|
| id | Integer PK | Auto-increment |
| municipality | String(255) | Indexed |
| zone | Integer | Indexed |
| section | Integer | Indexed |
| file_name | String(512) | |
| file_hash | String(64) | SHA256 |
| s3_key | String(1024) | Nullable (Phase 03) |
| status | String(50) | pending/processing/processed/failed |
| error_message | String(1024) | Nullable |
| uploaded_by | String(255) | User ID |
| uploaded_by_name | String(255) | Display name |
| created_at | DateTime(tz) | Server default |

**Unique constraint**: `municipality + zone + section`

### Vote
| Field | Type | Notes |
|---|---|---|
| id | Integer PK | |
| boletim_urna_id | Integer FK | → boletim_urna.id |
| office | String(255) | |
| candidate_number | String(20) | Indexed |
| candidate_name | String(255) | |
| party | String(50) | Nullable |
| vote_count | Integer | |

### ProcessedFile
| Field | Type | Notes |
|---|---|---|
| id | Integer PK | |
| file_hash | String(64) | Unique |
| processed_at | DateTime(tz) | Server default |

---

## How to Extend

### Add a new API endpoint
1. Create `app/api/new_endpoint.py` with an `APIRouter`.
2. Add business logic to `app/services/bu_service.py` or create a new service.
3. Add repository methods if database access is needed.
4. Register the router in `app/main.py` with `app.include_router(...)`.
5. Add Pydantic schemas in `app/schemas/`.

### Replace MockBUParser with real PDF parser
1. Create `app/parsers/real_bu_parser.py` implementing `BUParser`.
2. Override the `parse(file_path: str) -> ParsedBU` method.
3. In `app/services/bu_service.py`, change the default parser:
   ```python
   self._parser: BUParser = parser or RealBUParser()
   ```
4. No other changes required.

### Add a new database migration
```bash
cd backend
poetry run alembic revision --autogenerate -m "description"
poetry run alembic upgrade head
```

### Add a new test
- Unit tests: `tests/unit/test_*.py` — mock all external dependencies.
- Integration tests: `tests/integration/test_*.py` — use the `client` fixture (SQLite in-memory).

### Add S3 integration (Phase 03)
1. Add `boto3` to dependencies.
2. Create `app/services/storage_service.py`.
3. Update `BUService.upload_bu()` to store the file in S3 and set `s3_key` on the `BoletimUrna` record.
4. Update `Dockerfile` and `.env` with AWS credentials.

---

## Known Limitations

- **No real PDF parsing** — MockBUParser generates simulated data.
- **No S3 integration** — files are not stored in object storage.
- **No EventBridge/SQS** — processing is synchronous (no async queue).
- **No authentication** — API endpoints are publicly accessible.
- **No real-time updates** — no WebSocket or polling.
- **Single municipality** — hardcoded to Florianópolis.
- **Timeline query uses SQLite-compatible SQL** — in production (PostgreSQL), consider using `date_trunc` for more accurate hourly grouping.
- **No rate limiting** — upload endpoint has no throttling.

---

## Next Suggested Steps

1. **Phase 03 — API Integration**: Replace `buService` mock methods in the frontend with real HTTP calls to this backend.
2. **Phase 04 — Authentication**: Implement JWT-based auth. Add `/auth/login` endpoint. Protect all API routes.
3. **Phase 05 — Real BU Parser**: Implement `RealBUParser` using `pdfplumber` or `pypdf` to extract actual vote data from BU PDFs.
4. **Phase 06 — AWS Infrastructure**: Add S3 upload, EventBridge routing, SQS queue, and Lambda parser worker via Terraform.
5. **Phase 07 — Real-time**: Add WebSocket or SSE for live processing status updates.
