# Product Specification

## Product Name

Parallel Election Tabulation System

## Purpose

This system allows election observers to aggregate vote results from Boletins de Urna (BU) before the official consolidation published by the electoral authority.

The system receives structured PDFs generated from the Boletim na Mão application, parses the vote data contained in the document, and consolidates vote counts for analysis by a central monitoring team.

The goal is to provide near real-time visibility of vote totals based on collected BUs.

This system does not replace official vote counting and must not be used as an official election result system.

---

## Target Users

### Field Inspectors
Responsible for collecting BUs from voting sections and uploading them to the system.

### Central Analysis Team
Responsible for monitoring vote aggregation, verifying coverage of voting sections, and analyzing results.

---

## Scope (POC)

The initial proof of concept will process:

- Up to **5000 Boletins de Urna**
- From **one municipality**
- During a **national election scenario**

---

## Key Objectives

1. Receive BU PDFs uploaded by inspectors.
2. Parse vote information from each BU.
3. Store extracted vote data.
4. Consolidate vote counts per candidate.
5. Provide dashboards for monitoring vote aggregation progress.

---

## Non Goals

The system will not:

- Perform official vote counting
- Integrate with official electoral authority systems
- Replace electoral auditing mechanisms