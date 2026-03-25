# Development Rules

## General Rules

- The system must follow a modular architecture.
- All components must be loosely coupled.
- Business logic must not exist in API controllers.
- All parsing logic must be isolated in a dedicated parser module.

---

## Parser Isolation

The BU parsing logic must exist in a single class.

Example:

class BUParser:

Responsibilities:

- receive BU PDF
- extract text
- parse vote information
- return structured data

No other component in the system may parse BU documents.

If the BU layout changes, only this class should require modification.

---

## Idempotency

The system must guarantee idempotent processing of BU files.

Each BU must be processed only once.

To guarantee this:

- A SHA256 hash must be calculated for each uploaded file.
- If the hash already exists in the system, the file must be ignored.

---

## BU Uniqueness

Each BU must be unique by the combination:

municipality + zone + section

If another BU is uploaded for the same section, the system must reject or flag the upload.

---

## Storage Rules

PDF files must be stored in object storage with the following structure:

raw/
processing/
processed/

Processed files must never be overwritten.

---

## Security Rules

Only authenticated users can upload BU files.

All uploads must use signed URLs.

---

## Error Handling

If parsing fails:

- the BU must be moved to a failed folder
- an error event must be logged
- the file must not be retried automatically