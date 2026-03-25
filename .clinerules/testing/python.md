# Python Testing Standards

All backend code must include automated tests.

---

## Test Framework

Use pytest.

---

## Test Structure

tests/
  unit/
  integration/

---

## Unit Tests

Unit tests must isolate the tested component.

Mock external dependencies such as:

- database
- S3
- queues

---

## Parser Testing

The BU parser must include dedicated tests.

Test cases must include:

- valid BU
- malformed BU
- layout variations

---

## Test Coverage

Target coverage: minimum 80%.

Critical modules must have higher coverage.

Examples:

- parser
- vote aggregation