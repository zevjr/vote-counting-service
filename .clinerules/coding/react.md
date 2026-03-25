# React Coding Standards

All frontend code must follow modern React best practices.

---

## Components

Prefer functional components.

Avoid class components.

---

## Hooks

Use React hooks for state management.

Examples:

useState
useEffect
useMemo

---

## Component Size

Components must remain small and focused.

Avoid components larger than ~300 lines.

---

## API Calls

All API calls must be centralized in service modules.

Example:

services/api.ts

---

## Styling

Use consistent styling approach.

Examples:

- Tailwind
- CSS modules

Avoid inline styling.