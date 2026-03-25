# Frontend Architecture Rules

Frontend must be implemented using React or Next.js.

The architecture must follow component-based design.

---

## Project Structure

src/
  components/
  pages/
  hooks/
  services/
  utils/

---

## Responsibilities

Frontend responsibilities:

- Upload BU PDFs
- Display aggregation results
- Show processing progress

Business logic must remain in the backend.

---

## State Management

State must be predictable and centralized when necessary.

Use React hooks.

Avoid deeply nested component state.

---

## API Integration

All backend communication must go through a dedicated service layer.

Example:

services/api.ts

No component should call APIs directly.

---

## Component Design

Components must follow:

- single responsibility
- reusability
- composability

Avoid large monolithic components.