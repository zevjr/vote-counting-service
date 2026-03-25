# Phase 01 — Frontend Prototype

This task is the first implementation step of the BU Election Monitor system.

The goal is to build a visual prototype of the frontend using mocked data.

No backend, infrastructure, or database must be implemented in this phase.

The frontend must simulate the expected user experience so the product flow can be validated before backend development begins.

---

# Reference Documentation

The implementation must follow all existing project rules and architecture definitions.

Relevant documents:

docs/product_spec.md  
docs/functional_spec.md  
docs/system_architecture.md  

.clinerules/architecture/frontend.md
.clinerules/coding/react.md 
.clinerules/testing/react.md  

---

# Scope of this Phase

Only implement:

Frontend Web Application (React)

The application must run locally and use mocked data.

The goal is to simulate the experience of users uploading BU files and viewing aggregated election results.

---

# Users

Two types of users must be considered in the UI:

### Local Inspector

Responsible for uploading Boletim de Urna PDFs.

### Central Team

Responsible for viewing aggregated results and monitoring election progress.

Authentication is NOT required for now.

---

# Frontend Technology

The frontend must use:

React  
TypeScript  
Modern component architecture

Recommended stack:

React  
Vite  
React Router  
Simple CSS or Tailwind

No backend integration is allowed yet.

---

# Required Pages

## Dashboard

Shows election progress and aggregated results.

Example components:

- Total sections processed
- Total sections expected
- Progress bar
- Votes by candidate
- Votes by office

Data must be mocked.

---

## Upload BU Page

Page where a user uploads a Boletim de Urna PDF.

UI elements:

Upload area (drag and drop)

Upload button

List of recently uploaded files

File status indicator:

Pending  
Processed  
Failed

Uploads must be simulated with mock state.

No real S3 integration.

---

## BU List Page

Displays all uploaded Boletim de Urna records.

Table fields:

Municipality  
Zone  
Section  
Upload Date  
Processing Status  

Use mocked dataset.

---

## Results Page

Displays aggregated election results.

Example views:

Votes by candidate  
Votes by office  
Section coverage map (optional placeholder)

All data must be mocked.

---

# Mock Data

Create a mock dataset representing:

- municipalities
- zones
- sections
- candidates
- vote totals

This dataset must simulate a realistic election scenario.

The mock data should live in:

src/mocks/

---

# UI Structure

Suggested structure:

src/
  components/
  pages/
  layouts/
  mocks/
  services/
  routes/

Routing must be implemented using React Router.

---

# UX Requirements

The UI must prioritize clarity and simplicity.

The interface should allow a user to:

1. Upload BU files
2. See processing status
3. View aggregated election results
4. Track election coverage

The layout must be responsive.

---

# Deliverables

The following must be produced:

React project scaffold  
Navigation between pages  
Mocked data services  
Basic visual components  
Clean folder structure  

The application must run with:

npm install  
npm run dev

---

# Explicit Non-Goals

The following must NOT be implemented in this phase:

Backend services  
Lambda functions  
S3 integration  
EventBridge  
Database access  
Terraform infrastructure  

These will be implemented in later phases.

---

# Expected Outcome

At the end of this phase we should have a fully navigable frontend prototype that simulates the complete user flow using mocked data.

This prototype will be used to validate product usability before backend implementation begins.