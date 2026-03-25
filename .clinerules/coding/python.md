# Python Coding Standards

All Python code must follow modern Python best practices.

---

## Language Version

Python 3.12+

---

## Code Style

Follow PEP8 guidelines.

Use:

- black for formatting
- isort for import ordering

---

## Type Safety

All functions must include type hints.

Example:

def parse_votes(file_path: str) -> ParsedBU:

---

## Class Design

Classes must follow single responsibility principle.

Avoid large utility classes.

---

## Error Handling

Use explicit exception handling.

Avoid silent failures.

---

## Logging

Use structured logging.

Include:

- request id
- section identifiers
- processing status

---

## Dependency Management

Use a lock file for dependencies.

Examples:

- poetry
- pip-tools